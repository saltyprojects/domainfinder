import os
import re
import requests as http_requests
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import (
    DomainResultSerializer, DomainSearchSerializer,
    SuggestionSerializer, WhoisQuerySerializer, WhoisResultSerializer,
)
from .services import search_domains, check_domain_availability
from .generators import generate_suggestions
from .whois_services import lookup_domain_rdap


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

    if token_resp.status_code != 200:
        return HttpResponse(f"Token exchange failed: {token_resp.text}", status=400)

    data = token_resp.json()
    access_token = data.get('access_token', '')
    expires_in = data.get('expires_in', 0)

    # Store in env (will need to persist to Railway separately)
    os.environ['DOMY_LINKEDIN_ACCESS_TOKEN'] = access_token

    # Get profile info to confirm it worked
    profile_resp = http_requests.get('https://api.linkedin.com/v2/userinfo', headers={
        'Authorization': f'Bearer {access_token}',
    }, timeout=10)
    profile = profile_resp.json() if profile_resp.status_code == 200 else {}

    return HttpResponse(
        f"<h1>✅ LinkedIn Connected!</h1>"
        f"<p>Logged in as: {profile.get('name', 'Unknown')}</p>"
        f"<p>Token expires in: {expires_in // 86400} days</p>"
        f"<p>Access token (first 20 chars): {access_token[:20]}...</p>"
        f"<p><strong>Token has been stored. Domy can now post to LinkedIn!</strong></p>",
        content_type='text/html'
    )
