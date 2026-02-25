import concurrent.futures
import os
import dns.resolver
import requests
from django.conf import settings
from django.core.cache import cache

GODADDY_API_KEY = os.environ.get('GODADDY_API_KEY', '')
GODADDY_API_SECRET = os.environ.get('GODADDY_API_SECRET', '')
GODADDY_BASE = 'https://api.godaddy.com/v1'


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
    """Fallback: Check domain availability via DNS lookup."""
    full_domain = f"{name}.{tld}"
    cache_key = f"domain:{full_domain}"

    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    available = True
    resolver = dns.resolver.Resolver()
    resolver.timeout = 2
    resolver.lifetime = 2
    try:
        resolver.resolve(full_domain, 'A')
        available = False
    except dns.resolver.NXDOMAIN:
        # Domain definitely doesn't exist = available
        available = True
    except dns.resolver.NoNameservers:
        # No nameservers = likely available
        available = True
    except dns.resolver.NoAnswer:
        # Has DNS record but no A record — domain exists, probably taken
        # But also try NS record to be sure
        try:
            dns.resolver.resolve(full_domain, 'NS')
            available = False
        except Exception:
            available = True
    except dns.resolver.LifetimeTimeout:
        # Timeout — could go either way, default to available for better UX
        available = True
    except Exception:
        # Unknown error — default to available (better than false negatives)
        available = True

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


def check_domain_availability(name: str, tld: str) -> dict:
    """Check domain availability using best available method."""
    if GODADDY_API_KEY:
        return check_domain_godaddy(name, tld)
    return check_domain_dns(name, tld)


def search_domains(name: str) -> list[dict]:
    """Check availability across all configured TLDs concurrently."""
    tlds = settings.DOMAIN_TLDS

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
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
    """Yield domain check results as they complete (for SSE streaming)."""
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {
            executor.submit(check_domain_availability, name, tld): tld
            for tld in tlds
        }
        for future in concurrent.futures.as_completed(futures):
            yield future.result()
