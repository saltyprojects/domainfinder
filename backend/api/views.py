import re
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import (
    DomainResultSerializer, DomainSearchSerializer, SocialHandleResultSerializer,
    WhoisQuerySerializer, WhoisResultSerializer,
)
from .services import search_domains
from .social_services import check_all_handles
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

        # Strip any TLD if user typed "example.com"
        query = query.split('.')[0]

        # Validate domain name format
        if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$', query):
            return Response(
                {'error': 'Invalid domain name. Use only letters, numbers, and hyphens.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = search_domains(query)
        output = DomainResultSerializer(results, many=True)

        # Also check social handles
        social_results = check_all_handles(query)
        social_output = SocialHandleResultSerializer(social_results, many=True)

        return Response({
            'query': query,
            'results': output.data,
            'social': social_output.data,
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
