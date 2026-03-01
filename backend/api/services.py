import concurrent.futures
import os
import dns.resolver
import requests
import whois
from django.conf import settings

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


_rdap_cache: dict[str, bool | None] = {}


def check_rdap_registration(full_domain: str, tld: str) -> bool | None:
    """Check if domain is registered via RDAP. Returns True=taken, False=available, None=unknown."""
    if full_domain in _rdap_cache:
        return _rdap_cache[full_domain]

    # Try TLD-specific server first, then universal fallback
    base_tld = tld.split('.')[-1]  # handle compound TLDs like co.uk
    urls = []
    if base_tld in RDAP_SERVERS:
        urls.append(f"{RDAP_SERVERS[base_tld]}/domain/{full_domain}")
    urls.append(f"https://rdap.org/domain/{full_domain}")

    result = None
    for url in urls:
        try:
            resp = requests.get(
                url,
                timeout=3,
                headers={'Accept': 'application/rdap+json'},
                allow_redirects=True,
            )
            if resp.status_code == 200:
                result = True  # Domain found = registered = taken
                break
            elif resp.status_code == 404:
                result = False  # Not found = available
                break
        except Exception:
            continue  # Try next URL

    # WHOIS fallback if RDAP was inconclusive
    if result is None:
        try:
            w = whois.whois(full_domain)
            if w and w.domain_name:
                result = True  # WHOIS found registration = taken
            else:
                result = False
        except Exception:
            result = None  # Truly unknown

    _rdap_cache[full_domain] = result
    return result


def check_domain_godaddy(name: str, tld: str) -> dict:
    """Check domain availability via GoDaddy API (accurate + pricing)."""
    full_domain = f"{name}.{tld}"


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
            # API error (403, 401, etc.) — fall back to DNS+RDAP
            result = check_domain_dns_verified(name, tld)
    except Exception:
        # Fallback to DNS+RDAP check
        result = check_domain_dns_verified(name, tld)

    return result


def check_domain_availability_cached(name: str, tld: str) -> dict:
    """Check with longer cache for suggestions (30 min)."""
    full_domain = f"{name}.{tld}"
    result = check_domain_availability(name, tld)
    return result


def check_domain_dns(name: str, tld: str) -> dict:
    """Fast domain availability check via DNS with hard timeout."""
    full_domain = f"{name}.{tld}"


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

    return result


def check_domain_dns_verified(name: str, tld: str) -> dict:
    """DNS check + RDAP verification for accuracy. Slower but accurate."""
    result = check_domain_dns(name, tld)
    if result['available']:
        rdap_result = check_rdap_registration(result['full_domain'], tld)
        if rdap_result is True:
            result['available'] = False
    return result


def check_domain_availability(name: str, tld: str) -> dict:
    """Check domain availability using best available method."""
    if GODADDY_API_KEY:
        return check_domain_godaddy(name, tld)
    return check_domain_dns_verified(name, tld)


def search_domains(name: str, tlds=None) -> list[dict]:
    """Check availability across TLDs concurrently."""
    if tlds is None:
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
    DNS-only for speed. No RDAP verification in the hot path.
    """
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = {
            executor.submit(check_domain_availability, name, tld): tld
            for tld in tlds
        }
        for future in concurrent.futures.as_completed(futures):
            yield future.result()
