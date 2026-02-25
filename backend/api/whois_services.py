import httpx
from django.core.cache import cache
from datetime import datetime


# RDAP bootstrap: maps TLDs to RDAP servers
RDAP_BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json"

# Cache the bootstrap data for 24 hours
def get_rdap_server(tld: str) -> str | None:
    """Find the RDAP server for a given TLD using IANA bootstrap."""
    bootstrap = cache.get("rdap:bootstrap")
    if bootstrap is None:
        try:
            with httpx.Client(timeout=10) as client:
                resp = client.get(RDAP_BOOTSTRAP_URL)
                resp.raise_for_status()
                data = resp.json()
                # Build TLD -> server mapping
                bootstrap = {}
                for entry in data.get("services", []):
                    tlds_list, servers = entry
                    server_url = servers[0] if servers else None
                    for t in tlds_list:
                        bootstrap[t.lower()] = server_url
                cache.set("rdap:bootstrap", bootstrap, timeout=86400)
        except Exception:
            return None

    return bootstrap.get(tld.lower())


def parse_rdap_date(date_str: str | None) -> str | None:
    """Parse RDAP date string to ISO format date."""
    if not date_str:
        return None
    try:
        # RDAP dates are usually ISO 8601
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except (ValueError, TypeError):
        return date_str[:10] if date_str and len(date_str) >= 10 else None


def lookup_domain_rdap(full_domain: str) -> dict:
    """Look up domain WHOIS data via RDAP protocol."""
    cache_key = f"whois:{full_domain}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    parts = full_domain.rsplit(".", 1)
    if len(parts) != 2:
        return {"error": "Invalid domain format"}

    name, tld = parts
    rdap_server = get_rdap_server(tld)

    if not rdap_server:
        return {
            "domain": full_domain,
            "error": f"No RDAP server found for .{tld}",
        }

    url = f"{rdap_server}domain/{full_domain}"

    try:
        with httpx.Client(timeout=10, follow_redirects=True) as client:
            resp = client.get(url)

            if resp.status_code == 404:
                result = {
                    "domain": full_domain,
                    "available": True,
                    "registrar": None,
                    "registered_date": None,
                    "expiry_date": None,
                    "updated_date": None,
                    "status": [],
                    "nameservers": [],
                }
                cache.set(cache_key, result, timeout=300)
                return result

            resp.raise_for_status()
            data = resp.json()
    except Exception as e:
        return {"domain": full_domain, "error": f"RDAP lookup failed: {str(e)}"}

    # Parse events (registration, expiration, last changed)
    events = {}
    for event in data.get("events", []):
        action = event.get("eventAction", "")
        date = event.get("eventDate", "")
        events[action] = date

    # Parse registrar from entities
    registrar = None
    for entity in data.get("entities", []):
        roles = entity.get("roles", [])
        if "registrar" in roles:
            vcard = entity.get("vcardArray", [None, []])
            if len(vcard) > 1:
                for field in vcard[1]:
                    if field[0] == "fn":
                        registrar = field[3] if len(field) > 3 else None
                        break
            if not registrar:
                registrar = entity.get("handle", None)
            break

    # Parse status
    statuses = data.get("status", [])

    # Parse nameservers
    nameservers = []
    for ns in data.get("nameservers", []):
        ns_name = ns.get("ldhName", "")
        if ns_name:
            nameservers.append(ns_name.lower())

    # Check if expiring soon (within 90 days)
    expiry_str = events.get("expiration")
    expiring_soon = False
    if expiry_str:
        try:
            expiry_dt = datetime.fromisoformat(expiry_str.replace("Z", "+00:00"))
            from datetime import timezone
            days_until = (expiry_dt - datetime.now(timezone.utc)).days
            expiring_soon = 0 < days_until <= 90
        except (ValueError, TypeError):
            pass

    result = {
        "domain": full_domain,
        "available": False,
        "registrar": registrar,
        "registered_date": parse_rdap_date(events.get("registration")),
        "expiry_date": parse_rdap_date(events.get("expiration")),
        "updated_date": parse_rdap_date(events.get("last changed")),
        "status": statuses,
        "nameservers": nameservers,
        "expiring_soon": expiring_soon,
    }

    cache.set(cache_key, result, timeout=300)
    return result
