import json
import os
import re
import requests as http_requests
from django.conf import settings
from django.core.cache import cache as django_cache
from django.http import HttpResponse, StreamingHttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import (
    DomainResultSerializer, DomainSearchSerializer,
    SuggestionSerializer, WhoisQuerySerializer, WhoisResultSerializer,
)
from .services import search_domains, check_domain_availability, stream_domain_checks
from .generators import generate_suggestions
from .whois_services import lookup_domain_rdap
from .trademark_services import search_uspto_trademarks, get_risk_assessment


class DomainSearchViewSet(viewsets.ViewSet):
    """
    Domain availability search.

    list: Search domain availability across TLDs.
        Query params: ?q=<domain_name>
    """

    def list(self, request):
        serializer = DomainSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        query = serializer.validated_data['q'].lower().strip()
        query = query.split('.')[0]

        if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$', query):
            return Response(
                {'error': 'Invalid domain name. Use only letters, numbers, and hyphens.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = search_domains(query)
        output = DomainResultSerializer(results, many=True)
        return Response({
            'query': query,
            'results': output.data,
        })


class SuggestionsViewSet(viewsets.ViewSet):
    """
    Domain name suggestions.

    list: Generate name suggestions and check .com availability.
        Query params: ?q=<base_name>
    """

    def list(self, request):
        serializer = DomainSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        query = serializer.validated_data['q'].lower().strip()
        query = query.split('.')[0]

        names = generate_suggestions(query)

        # Check .com availability for top suggestions
        results = []
        for name in names[:30]:
            full_domain = f"{name}.com"
            check = check_domain_availability(name, 'com')
            results.append({
                'name': name,
                'available': check['available'],
                'full_domain': full_domain,
            })

        output = SuggestionSerializer(results, many=True)
        return Response({
            'query': query,
            'suggestions': output.data,
        })


class WhoisViewSet(viewsets.ViewSet):
    """
    WHOIS/RDAP domain intelligence lookup.

    list: Look up WHOIS data for a domain.
        Query params: ?domain=<full_domain>
    """

    def list(self, request):
        serializer = WhoisQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        domain = serializer.validated_data['domain'].lower().strip()
        result = lookup_domain_rdap(domain)
        output = WhoisResultSerializer(result)

        return Response(output.data)


class TrademarkViewSet(viewsets.ViewSet):
    """
    USPTO trademark conflict checker.

    list: Check for trademark conflicts.
        Query params: ?q=<domain_name>
    """

    def list(self, request):
        serializer = DomainSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        query = serializer.validated_data['q'].lower().strip()
        
        # Get full trademark search results
        trademark_results = search_uspto_trademarks(query)
        
        # Get simplified risk assessment
        risk_assessment = get_risk_assessment(query)
        
        return Response({
            'query': query,
            'risk_assessment': risk_assessment,
            'details': trademark_results,
        })


def search_stream(request):
    """SSE endpoint: stream domain availability results as they arrive."""
    q = request.GET.get('q', '').lower().strip().split('.')[0]

    if not q or len(q) < 2:
        return HttpResponse(json.dumps({'error': 'Query too short'}), content_type='application/json', status=400)

    if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$', q):
        return HttpResponse(json.dumps({'error': 'Invalid domain name'}), content_type='application/json', status=400)

    def event_stream():
        tlds = settings.DOMAIN_TLDS
        yield f"data: {json.dumps({'type': 'start', 'query': q, 'total': len(tlds)})}\n\n"

        for result in stream_domain_checks(q, tlds):
            yield f"data: {json.dumps({'type': 'result', **result})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response


def social_whois_stream(request):
    """SSE endpoint: stream social + WHOIS data for domains."""
    import concurrent.futures
    from .social_services import check_all_handles
    from .whois_services import lookup_domain_rdap
    
    domains = request.GET.get('domains', '').split(',')
    domains = [d.strip() for d in domains if d.strip()]
    
    if not domains:
        return HttpResponse(json.dumps({'error': 'No domains provided'}), content_type='application/json', status=400)

    def get_domain_intel(domain_name):
        """Get social + WHOIS data for a single domain name."""
        try:
            # For available domains, check social handles
            social_data = check_all_handles(domain_name)
            
            # For taken domains, get WHOIS data  
            whois_data = lookup_domain_rdap(f"{domain_name}.com")  # Default to .com for WHOIS
            
            return {
                'domain': domain_name,
                'social': social_data,
                'whois': whois_data,
            }
        except Exception as e:
            return {
                'domain': domain_name,
                'error': str(e),
                'social': [],
                'whois': None,
            }

    def event_stream():
        yield f"data: {json.dumps({'type': 'start', 'total': len(domains)})}\n\n"
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_to_domain = {executor.submit(get_domain_intel, domain): domain for domain in domains}
            
            for future in concurrent.futures.as_completed(future_to_domain):
                try:
                    result = future.result()
                    yield f"data: {json.dumps({'type': 'intel', **result})}\n\n"
                except Exception as e:
                    domain = future_to_domain[future]
                    yield f"data: {json.dumps({'type': 'intel', 'domain': domain, 'error': str(e)})}\n\n"
        
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response


@api_view(['GET'])
def linkedin_callback(request):
    """Exchange LinkedIn OAuth code for access token and store it."""
    code = request.query_params.get('code')
    error = request.query_params.get('error')

    if error:
        return HttpResponse(f"LinkedIn OAuth error: {error} - {request.query_params.get('error_description', '')}", status=400)

    if not code:
        return HttpResponse("Missing 'code' parameter.", status=400)

    # Exchange code for access token
    token_resp = http_requests.post('https://www.linkedin.com/oauth/v2/accessToken', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'https://api.domydomains.com/api/linkedin/callback/',
        'client_id': os.environ.get('DOMY_LINKED_IN_CLIENT_ID', ''),
        'client_secret': os.environ.get('DOMY_LINKED_IN_CLIENT_SECRET', ''),
    }, headers={'Content-Type': 'application/x-www-form-urlencoded'}, timeout=15)

    return HttpResponse(token_resp.text, content_type='application/json', status=token_resp.status_code)


@api_view(['POST'])
def flush_cache(request):
    """Flush the domain cache. Requires secret key."""
    secret = request.query_params.get('key', '')
    if secret != os.environ.get('DJANGO_SECRET_KEY', 'x'):
        return HttpResponse('Unauthorized', status=401)
    django_cache.clear()
    return HttpResponse('Cache flushed', status=200)
