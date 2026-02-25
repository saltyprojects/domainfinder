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


class SocialHandleResultSerializer(serializers.Serializer):
    platform = serializers.CharField()
    display_name = serializers.CharField()
    username = serializers.CharField()
    url = serializers.CharField()
    available = serializers.BooleanField(allow_null=True)


class WhoisQuerySerializer(serializers.Serializer):
    domain = serializers.CharField(
        required=True,
        help_text='Full domain name (e.g. example.com)',
        min_length=3,
        max_length=253,
    )


class WhoisResultSerializer(serializers.Serializer):
    domain = serializers.CharField()
    available = serializers.BooleanField(required=False)
    registrar = serializers.CharField(allow_null=True, required=False)
    registered_date = serializers.CharField(allow_null=True, required=False)
    expiry_date = serializers.CharField(allow_null=True, required=False)
    updated_date = serializers.CharField(allow_null=True, required=False)
    status = serializers.ListField(child=serializers.CharField(), required=False)
    nameservers = serializers.ListField(child=serializers.CharField(), required=False)
    expiring_soon = serializers.BooleanField(required=False)
    error = serializers.CharField(required=False)
