import logging
from datetime import datetime, timedelta, timezone
from django.core.cache import cache
from .whois_services import lookup_domain_rdap
import concurrent.futures

logger = logging.getLogger(__name__)

# Popular domains to check for expiry - these would normally be from a database
# of tracked domains or user watchlists
POPULAR_DOMAINS_TO_TRACK = [
    'example.com', 'test.com', 'demo.com', 'sample.com', 'placeholder.com',
    'tempuri.org', 'contoso.com', 'fabrikam.com', 'adventureworks.com',
    'northwind.com', 'litware.com', 'trey.com', 'fourthcoffee.com',
    'wingtip.com', 'tailspin.com', 'coho.com', 'alpine.com', 'proseware.com'
]


def parse_expiry_date(date_str):
    """Parse expiry date string to datetime object."""
    if not date_str:
        return None
    
    try:
        # Handle different date formats
        if 'T' in date_str:
            # ISO format: 2026-12-31T23:59:59Z
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        else:
            # Date only format: 2026-12-31
            dt = datetime.strptime(date_str, '%Y-%m-%d').replace(tzinfo=timezone.utc)
        return dt
    except (ValueError, TypeError) as e:
        logger.warning(f"Failed to parse expiry date '{date_str}': {e}")
        return None


def get_days_until_expiry(expiry_date_str):
    """Calculate days until expiry from date string."""
    expiry_dt = parse_expiry_date(expiry_date_str)
    if not expiry_dt:
        return None
    
    now = datetime.now(timezone.utc)
    delta = expiry_dt - now
    return delta.days


def categorize_expiry_urgency(days_until_expiry):
    """Categorize expiry urgency based on days remaining."""
    if days_until_expiry is None:
        return None
    
    if days_until_expiry < 0:
        return "EXPIRED"
    elif days_until_expiry <= 7:
        return "CRITICAL"  # Red alert
    elif days_until_expiry <= 30:
        return "WARNING"   # Orange alert
    elif days_until_expiry <= 90:
        return "NOTICE"    # Yellow alert
    else:
        return "STABLE"    # Green/no alert


def get_expiry_message(domain_name, days_until_expiry, urgency):
    """Generate human-readable expiry message."""
    if urgency == "EXPIRED":
        return f"⚠️ {domain_name} expired {abs(days_until_expiry)} days ago"
    elif urgency == "CRITICAL":
        return f"🚨 {domain_name} expires in {days_until_expiry} days!"
    elif urgency == "WARNING":
        return f"⚠️ {domain_name} expires in {days_until_expiry} days"
    elif urgency == "NOTICE":
        return f"📅 {domain_name} expires in {days_until_expiry} days"
    else:
        return f"✅ {domain_name} expires in {days_until_expiry} days"


def check_domain_expiry(domain_name):
    """Check expiry information for a single domain."""
    try:
        whois_data = lookup_domain_rdap(domain_name)
        
        if whois_data.get('available'):
            return {
                'domain': domain_name,
                'available': True,
                'status': 'AVAILABLE',
                'message': f"✅ {domain_name} is available for registration"
            }
        
        expiry_date = whois_data.get('expiry_date')
        if not expiry_date:
            return {
                'domain': domain_name,
                'available': False,
                'status': 'UNKNOWN',
                'message': f"❓ Expiry date not available for {domain_name}",
                'whois_data': whois_data
            }
        
        days_until_expiry = get_days_until_expiry(expiry_date)
        urgency = categorize_expiry_urgency(days_until_expiry)
        message = get_expiry_message(domain_name, days_until_expiry, urgency)
        
        return {
            'domain': domain_name,
            'available': False,
            'expiry_date': expiry_date,
            'days_until_expiry': days_until_expiry,
            'urgency': urgency,
            'status': urgency,
            'message': message,
            'registrar': whois_data.get('registrar'),
            'registered_date': whois_data.get('registered_date'),
            'whois_data': whois_data
        }
        
    except Exception as e:
        logger.error(f"Failed to check expiry for {domain_name}: {e}")
        return {
            'domain': domain_name,
            'status': 'ERROR',
            'message': f"❌ Could not check expiry for {domain_name}",
            'error': str(e)
        }


def find_expiring_domains(days_threshold=90, max_domains=20):
    """Find domains expiring within the specified threshold."""
    cache_key = f"expiring_domains:{days_threshold}:{max_domains}"
    cached_result = cache.get(cache_key)
    
    if cached_result is not None:
        return cached_result
    
    expiring_domains = []
    
    # Use ThreadPoolExecutor for concurrent checking
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        # Submit all domain checks
        future_to_domain = {
            executor.submit(check_domain_expiry, domain): domain 
            for domain in POPULAR_DOMAINS_TO_TRACK[:max_domains]
        }
        
        # Collect results
        for future in concurrent.futures.as_completed(future_to_domain):
            try:
                result = future.result()
                
                # Only include domains that are expiring within threshold
                if (result.get('days_until_expiry') is not None and 
                    0 <= result['days_until_expiry'] <= days_threshold):
                    expiring_domains.append(result)
                    
            except Exception as e:
                domain = future_to_domain[future]
                logger.error(f"Error processing {domain}: {e}")
    
    # Sort by urgency (expired first, then by days remaining)
    def sort_key(domain):
        days = domain.get('days_until_expiry', 999)
        if days < 0:
            return -1000 + days  # Expired domains first
        return days
    
    expiring_domains.sort(key=sort_key)
    
    result = {
        'expiring_domains': expiring_domains,
        'total_found': len(expiring_domains),
        'checked_domains': len(POPULAR_DOMAINS_TO_TRACK[:max_domains]),
        'threshold_days': days_threshold,
        'generated_at': datetime.now(timezone.utc).isoformat()
    }
    
    # Cache for 1 hour (expiry dates don't change frequently)
    cache.set(cache_key, result, timeout=3600)
    
    return result


def get_domain_expiry_info(domain_name):
    """Get detailed expiry information for a specific domain."""
    cache_key = f"domain_expiry:{domain_name}"
    cached_result = cache.get(cache_key)
    
    if cached_result is not None:
        return cached_result
    
    result = check_domain_expiry(domain_name)
    
    # Cache for 4 hours
    cache.set(cache_key, result, timeout=14400)
    
    return result


def get_expiring_domains_by_urgency():
    """Get expiring domains categorized by urgency level."""
    expiring_data = find_expiring_domains(days_threshold=90, max_domains=50)
    
    categorized = {
        'EXPIRED': [],
        'CRITICAL': [],   # <= 7 days
        'WARNING': [],    # <= 30 days
        'NOTICE': [],     # <= 90 days
    }
    
    for domain in expiring_data['expiring_domains']:
        urgency = domain.get('urgency', 'UNKNOWN')
        if urgency in categorized:
            categorized[urgency].append(domain)
    
    return {
        'categories': categorized,
        'summary': {
            'expired': len(categorized['EXPIRED']),
            'critical': len(categorized['CRITICAL']),
            'warning': len(categorized['WARNING']),
            'notice': len(categorized['NOTICE']),
        },
        'total_expiring': sum(len(domains) for domains in categorized.values()),
        'generated_at': expiring_data['generated_at']
    }