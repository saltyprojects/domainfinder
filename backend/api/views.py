import re
from rest_framework import viewsets, status
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
