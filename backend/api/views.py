import re
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import DomainResultSerializer, DomainSearchSerializer, SocialHandleResultSerializer
from .services import search_domains
from .social_services import check_all_handles


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
