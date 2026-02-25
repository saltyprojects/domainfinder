import concurrent.futures
import httpx
from django.core.cache import cache

# Platform check configs: (url_template, method_to_detect_available)
# We check if a profile URL returns 404 (available) or 200 (taken)
PLATFORMS = {
    'twitter': {
        'url': 'https://x.com/{}',
        'display_name': 'X / Twitter',
    },
    'instagram': {
        'url': 'https://www.instagram.com/{}/',
        'display_name': 'Instagram',
    },
    'tiktok': {
        'url': 'https://www.tiktok.com/@{}',
        'display_name': 'TikTok',
    },
    'github': {
        'url': 'https://github.com/{}',
        'display_name': 'GitHub',
    },
    'linkedin': {
        'url': 'https://www.linkedin.com/company/{}',
        'display_name': 'LinkedIn',
    },
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
}


def check_handle(platform: str, username: str) -> dict:
    """Check if a username is available on a specific platform."""
    config = PLATFORMS[platform]
    url = config['url'].format(username)
    cache_key = f"social:{platform}:{username}"

    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    available = None  # None = couldn't determine
    try:
        with httpx.Client(follow_redirects=True, timeout=8, headers=HEADERS) as client:
            resp = client.get(url)
            if resp.status_code == 404:
                available = True
            elif resp.status_code == 200:
                available = False
            # Some platforms redirect to login/home for nonexistent users
            elif resp.status_code in (301, 302, 303):
                available = True
            else:
                available = None
    except Exception:
        available = None

    result = {
        'platform': platform,
        'display_name': config['display_name'],
        'username': username,
        'url': url,
        'available': available,
    }

    cache.set(cache_key, result, timeout=300)
    return result


def check_all_handles(username: str) -> list[dict]:
    """Check handle availability across all platforms concurrently."""
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = {
            executor.submit(check_handle, platform, username): platform
            for platform in PLATFORMS
        }
        results = []
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())

    # Sort alphabetically by platform
    results.sort(key=lambda r: r['platform'])
    return results
