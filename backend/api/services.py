import concurrent.futures
import os
import dns.resolver
import requests
from django.conf import settings
from django.core.cache import cache

GODADDY_API_KEY = os.environ.get('GODADDY_API_KEY', '')
GODADDY_API_SECRET = os.environ.get('GODADDY_API_SECRET', '')
GODADDY_BASE = 'https://api.godaddy.com/v1'

# RDAP bootstrap URLs per TLD (common ones)
RDAP_SERVERS = {
    'com': 'https://rdap.verisign.com/com/v1',
    'net': 'https://rdap.verisign.com/net/v1',
    'org': 'https://rdap.org/org/v1',
    'io': 'https://rdap.identitydigital.services/rdap/v1',
    'dev': 'https://www.registry.google/rdap/',
    'app': 'https://www.registry.google/rdap/',
    'ai': 'https://rdap.nic.ai/v1',
    'co': 'https://rdap.nic.co/v1',
}


def check_rdap_registration(full_domain: str, tld: str) -> bool | None:
    """Check if domain is registered via RDAP. Returns True=taken, False=available, None=unknown."""
    try:
        # Try IANA RDAP bootstrap first (works for most TLDs)
        resp = requests.get(
            f'https://rdap.org/domain/{full_domain}',
            timeout=2,
            headers={'Accept': 'application/rdap+json'},
            allow_redirects=True,
        )
        if resp.status_code == 200:
            return True  # Domain found = registered = taken
        elif resp.status_code == 404:
            return False  # Not found = available
        return None  # Unknown
    except Exception:
        return None  # Can't determine


def check_domain_godaddy(name: str, tld: str) -> dict:
    """Check domain availability via GoDaddy API (accurate + pricing)."""
    full_domain = f"{name}.{tld}"
    cache_key = f"domain:{full_domain}"

    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    result = {
        'domain': name,
        'tld': tld,
        'full_domain': full_domain,
        'available': False,
        'price': None,
        'currency': None,
    }

    try:
        headers = {
            'Authorization': f'sso-key {GODADDY_API_KEY}:{GODADDY_API_SECRET}',
            'Accept': 'application/json',
        }
        resp = requests.get(
            f'{GODADDY_BASE}/domains/available',
            params={'domain': full_domain},
            headers=headers,
            timeout=5,
        )
        if resp.status_code == 200:
            data = resp.json()
            result['available'] = data.get('available', False)
            if data.get('price'):
                # GoDaddy returns price in micros (millionths)
                result['price'] = data['price'] / 1_000_000
                result['currency'] = data.get('currency', 'USD')
        else:
            # API error (403, 401, etc.) — fall back to DNS
            result = check_domain_dns(name, tld)
    except Exception:
        # Fallback to DNS check
        result = check_domain_dns(name, tld)

    cache.set(cache_key, result, timeout=300)
    return result


def check_domain_availability_cached(name: str, tld: str) -> dict:
    """Check with longer cache for suggestions (30 min)."""
    full_domain = f"{name}.{tld}"
    cache_key = f"domain:{full_domain}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached
    result = check_domain_availability(name, tld)
    cache.set(cache_key, result, timeout=1800)  # 30 min for suggestions
    return result


def check_domain_dns(name: str, tld: str) -> dict:
    """Fast domain availability check via DNS with hard timeout."""
    full_domain = f"{name}.{tld}"
    cache_key = f"domain:{full_domain}"

    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    available = True
    resolver = dns.resolver.Resolver()
    resolver.timeout = 0.5
    resolver.lifetime = 0.5
    try:
        resolver.resolve(full_domain, 'A')
        available = False  # Resolved = taken
    except dns.resolver.NXDOMAIN:
        available = True  # Doesn't exist = available
    except dns.resolver.NoAnswer:
        available = False  # Has records but no A = likely taken
    except (dns.resolver.NoNameservers, dns.resolver.LifetimeTimeout, Exception):
        available = True  # Timeout/error = assume available

    result = {
        'domain': name,
        'tld': tld,
        'full_domain': full_domain,
        'available': available,
        'price': None,
        'currency': None,
    }

    cache.set(cache_key, result, timeout=300)
    return result


def check_domain_dns_verified(name: str, tld: str) -> dict:
    """DNS check + RDAP verification for accuracy. Slower but accurate."""
    result = check_domain_dns(name, tld)
    if result['available']:
        rdap_result = check_rdap_registration(result['full_domain'], tld)
        if rdap_result is True:
            result['available'] = False
            cache.set(f"domain:{result['full_domain']}", result, timeout=300)
    return result


def check_domain_availability(name: str, tld: str) -> dict:
    """Check domain availability using best available method."""
    if GODADDY_API_KEY:
        return check_domain_godaddy(name, tld)
    return check_domain_dns(name, tld)


def search_domains(name: str) -> list[dict]:
    """Check availability across all configured TLDs concurrently."""
    tlds = settings.DOMAIN_TLDS

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = {
            executor.submit(check_domain_availability, name, tld): tld
            for tld in tlds
        }
        results = []
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())

    # Sort: .com first, then available first, then by price
    def sort_key(r):
        tld_priority = 0 if r['tld'] == 'com' else 1
        avail_priority = 0 if r['available'] else 1
        price = r.get('price') or 999
        return (tld_priority, avail_priority, price, r['tld'])

    results.sort(key=sort_key)
    return results


def stream_domain_checks(name: str, tlds: list[str]):
    """Yield domain check results as they complete (for SSE streaming).
    
    Phase 1: Fast DNS checks — stream results immediately.
    Phase 2: RDAP verification for domains that DNS says are available.
    Yields corrections if RDAP disagrees.
    """
    # Phase 1: Fast DNS/GoDaddy checks (all TLDs in parallel)
    dns_results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = {
            executor.submit(check_domain_availability, name, tld): tld
            for tld in tlds
        }
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            dns_results.append(result)
            yield result

    # Phase 2: RDAP verification for "available" domains (in background)
    available_results = [r for r in dns_results if r['available']]
    if available_results:
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = {
                executor.submit(check_rdap_registration, r['full_domain'], r['tld']): r
                for r in available_results
            }
            for future in concurrent.futures.as_completed(futures):
                original = futures[future]
                rdap_result = future.result()
                if rdap_result is True:
                    # RDAP says it's registered — send correction
                    corrected = {**original, 'available': False}
                    cache.set(f"domain:{original['full_domain']}", corrected, timeout=300)
                    yield {'_correction': True, **corrected}
