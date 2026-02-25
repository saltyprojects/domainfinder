import concurrent.futures
import dns.resolver
from django.conf import settings
from django.core.cache import cache


def check_domain_availability(name: str, tld: str) -> dict:
    """Check if a single domain is available via DNS lookup."""
    full_domain = f"{name}.{tld}"
    cache_key = f"domain:{full_domain}"

    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    available = True
    try:
        dns.resolver.resolve(full_domain, 'A')
        available = False
    except (dns.resolver.NXDOMAIN, dns.resolver.NoNameservers):
        available = True
    except (dns.resolver.NoAnswer, dns.resolver.LifetimeTimeout):
        available = False  # Domain exists but no A record, likely taken
    except Exception:
        available = False  # Assume taken on error

    result = {
        'domain': name,
        'tld': tld,
        'full_domain': full_domain,
        'available': available,
    }

    cache.set(cache_key, result, timeout=300)
    return result


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

    # Sort: .com first, then available first, then alphabetical
    def sort_key(r):
        tld_priority = 0 if r['tld'] == 'com' else 1
        avail_priority = 0 if r['available'] else 1
        return (tld_priority, avail_priority, r['tld'])

    results.sort(key=sort_key)
    return results
