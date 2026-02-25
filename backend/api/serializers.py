from rest_framework import serializers


class DomainResultSerializer(serializers.Serializer):
    domain = serializers.CharField()
    tld = serializers.CharField()
    available = serializers.BooleanField()
    full_domain = serializers.CharField()


class DomainSearchSerializer(serializers.Serializer):
    q = serializers.CharField(
        required=True,
        help_text='Domain name to search (without TLD)',
        min_length=1,
        max_length=63,
    )
