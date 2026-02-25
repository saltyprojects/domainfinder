import json
import os
import re
import requests as http_requests
from django.conf import settings
from django.core.cache import cache as django_cache
from django.http import HttpResponse, StreamingHttpResponse
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from django.db import transaction
from .serializers import (
    DomainResultSerializer, DomainSearchSerializer,
    SuggestionSerializer, WhoisQuerySerializer, WhoisResultSerializer,
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    DomainListSerializer, SavedDomainSerializer, DomainWatchlistSerializer,
    DomainAlertSerializer, ListShareSerializer,
)
from .services import search_domains, check_domain_availability, stream_domain_checks
from .generators import generate_suggestions
from .whois_services import lookup_domain_rdap
from .trademark_services import search_uspto_trademarks, get_risk_assessment
from .content_services import create_and_post_content, get_posting_stats, get_random_content
from .expiry_services import find_expiring_domains, get_domain_expiry_info, get_expiring_domains_by_urgency
from .seo_services import get_comprehensive_seo_analysis, get_seo_recommendations
from .models import User, DomainList, SavedDomain, DomainWatchlist, DomainAlert, ListShare


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


class SocialContentViewSet(viewsets.ViewSet):
    """
    Social media content generation and posting system.
    
    list: Get posting statistics and recent content
    create: Generate and post new content to social platforms
    """
    
    def list(self, request):
        """Get posting statistics and analytics."""
        stats = get_posting_stats()
        return Response(stats)
    
    def create(self, request):
        """Generate and post new content to social platforms."""
        # Get platforms from request, default to both
        platforms = request.data.get('platforms', ['twitter', 'instagram'])
        
        # Validate platforms
        valid_platforms = ['twitter', 'instagram']
        platforms = [p for p in platforms if p in valid_platforms]
        
        if not platforms:
            return Response(
                {'error': 'Invalid platforms. Choose from: twitter, instagram'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create and post content
        result = create_and_post_content(platforms)
        
        if result['success']:
            return Response({
                'success': True,
                'message': f"Content posted successfully to {len([p for p in result['platforms'] if result['platforms'][p]['success']])} platform(s)",
                'content': result['content'],
                'platforms': result['platforms']
            })
        else:
            return Response({
                'success': False,
                'message': 'Failed to post content',
                'error': result.get('error', 'Unknown error'),
                'platforms': result['platforms']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# User Authentication Views

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """User registration endpoint."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        # Create a default "My Domains" list for new users
        DomainList.objects.create(
            user=user,
            name="My Domains",
            description="Your saved domains"
        )
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    """User logout endpoint."""
    if request.user.is_authenticated:
        try:
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            pass
    return Response({'message': 'Logout successful'})


# Domain Management Views

class DomainListViewSet(viewsets.ModelViewSet):
    """ViewSet for managing domain lists."""
    serializer_class = DomainListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DomainList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_domain(self, request, pk=None):
        """Add a domain to this list."""
        domain_list = self.get_object()
        serializer = SavedDomainSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(domain_list=domain_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def remove_domain(self, request, pk=None):
        """Remove a domain from this list."""
        domain_list = self.get_object()
        domain_id = request.data.get('domain_id')
        
        try:
            domain = domain_list.domains.get(id=domain_id)
            domain.delete()
            return Response({'message': 'Domain removed successfully'})
        except SavedDomain.DoesNotExist:
            return Response({'error': 'Domain not found'}, status=status.HTTP_404_NOT_FOUND)


class DomainWatchlistViewSet(viewsets.ModelViewSet):
    """ViewSet for managing domain watchlists."""
    serializer_class = DomainWatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DomainWatchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DomainAlertViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing domain alerts."""
    serializer_class = DomainAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DomainAlert.objects.filter(watchlist__user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark an alert as read."""
        alert = self.get_object()
        alert.is_read = True
        alert.save()
        return Response({'message': 'Alert marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all alerts as read for the user."""
        alerts = self.get_queryset().filter(is_read=False)
        alerts.update(is_read=True)
        return Response({'message': f'Marked {alerts.count()} alerts as read'})


@api_view(['GET'])
def user_dashboard(request):
    """Get user dashboard data."""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    
    # Get user's lists and stats
    domain_lists = DomainList.objects.filter(user=user)
    watchlists = DomainWatchlist.objects.filter(user=user, is_active=True)
    alerts = DomainAlert.objects.filter(watchlist__user=user, is_read=False)
    
    total_domains = SavedDomain.objects.filter(domain_list__user=user).count()
    
    return Response({
        'user': UserSerializer(user).data,
        'stats': {
            'total_lists': domain_lists.count(),
            'total_domains': total_domains,
            'active_watchlists': watchlists.count(),
            'unread_alerts': alerts.count(),
        },
        'recent_lists': DomainListSerializer(domain_lists[:5], many=True).data,
        'recent_alerts': DomainAlertSerializer(alerts[:10], many=True).data,
    })


# Domain Expiry Views

@api_view(['GET'])
def expiring_domains(request):
    """Get domains that are expiring soon."""
    days_threshold = request.query_params.get('days', 90)
    max_domains = request.query_params.get('limit', 20)
    
    try:
        days_threshold = int(days_threshold)
        max_domains = int(max_domains)
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid parameters. days and limit must be integers.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Limit to reasonable ranges
    days_threshold = min(max(days_threshold, 1), 365)
    max_domains = min(max(max_domains, 1), 100)
    
    result = find_expiring_domains(days_threshold, max_domains)
    return Response(result)


@api_view(['GET'])
def expiring_domains_by_urgency(request):
    """Get expiring domains categorized by urgency level."""
    result = get_expiring_domains_by_urgency()
    return Response(result)


@api_view(['GET'])
def domain_expiry_info(request):
    """Get expiry information for a specific domain."""
    domain = request.query_params.get('domain')
    
    if not domain:
        return Response(
            {'error': 'domain parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Clean and validate domain name
    domain = domain.lower().strip()
    if not domain or len(domain) < 3:
        return Response(
            {'error': 'Invalid domain name'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    result = get_domain_expiry_info(domain)
    return Response(result)


# SEO Analytics Views

@api_view(['GET'])
def domain_seo_analysis(request):
    """Get comprehensive SEO analysis for a domain."""
    domain = request.query_params.get('domain')
    keyword = request.query_params.get('keyword')
    
    if not domain:
        return Response(
            {'error': 'domain parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Clean and validate domain name
    domain = domain.lower().strip()
    if not domain or len(domain) < 3:
        return Response(
            {'error': 'Invalid domain name'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Optional: Check if user is authenticated for Pro features
    # For now, we'll allow all users to see basic SEO data
    
    try:
        seo_analysis = get_comprehensive_seo_analysis(domain, keyword)
        recommendations = get_seo_recommendations(domain, seo_analysis)
        
        return Response({
            'analysis': seo_analysis,
            'recommendations': recommendations,
            'is_premium_feature': True,
            'note': 'This is a premium feature. Upgrade to Pro for real-time SEO data from leading providers.'
        })
        
    except Exception as e:
        logger.error(f"SEO analysis failed for {domain}: {e}")
        return Response(
            {'error': 'Failed to analyze SEO data', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def domain_seo_summary(request):
    """Get quick SEO summary for multiple domains (for search results)."""
    domains = request.query_params.get('domains', '').split(',')
    domains = [d.strip().lower() for d in domains if d.strip()]
    
    if not domains or len(domains) > 10:
        return Response(
            {'error': 'Provide 1-10 domains separated by commas'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    summaries = []
    
    for domain in domains:
        try:
            seo_data = get_comprehensive_seo_analysis(domain)
            
            # Return only key metrics for performance
            summary = {
                'domain': domain,
                'seo_score': seo_data.get('seo_score', 0),
                'domain_authority': seo_data.get('domain_authority', 0),
                'monthly_visitors': seo_data.get('traffic', {}).get('monthly_visitors', 0),
                'total_backlinks': seo_data.get('backlinks', {}).get('total_backlinks', 0),
                'trends_interest': seo_data.get('trends', {}).get('current_interest', 0)
            }
            summaries.append(summary)
            
        except Exception as e:
            logger.warning(f"SEO summary failed for {domain}: {e}")
            summaries.append({
                'domain': domain,
                'seo_score': 0,
                'domain_authority': 0,
                'monthly_visitors': 0,
                'total_backlinks': 0,
                'trends_interest': 0,
                'error': 'Analysis failed'
            })
    
    return Response({
        'summaries': summaries,
        'note': 'Basic SEO metrics. Get detailed analysis with Pro subscription.'
    })


@api_view(['GET'])
def preview_content(request):
    """Preview random content without posting."""
    content = get_random_content()
    return Response({
        'content': content,
        'formatted_post': {
            'text': content['text'],
            'hashtags': content['hashtags'],
            'full_text': f"{content['text']}\n\n{' '.join(content['hashtags'])}"
        }
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
