from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, DomainList, SavedDomain, DomainWatchlist, DomainAlert, ListShare


class DomainResultSerializer(serializers.Serializer):
    domain = serializers.CharField()
    tld = serializers.CharField()
    available = serializers.BooleanField()
    full_domain = serializers.CharField()
    price = serializers.FloatField(allow_null=True, required=False)
    currency = serializers.CharField(allow_null=True, required=False)


class DomainSearchSerializer(serializers.Serializer):
    q = serializers.CharField(
        required=True,
        help_text='Domain name to search (without TLD)',
        min_length=1,
        max_length=63,
    )


class SuggestionSerializer(serializers.Serializer):
    name = serializers.CharField()
    available = serializers.BooleanField(allow_null=True)
    full_domain = serializers.CharField()


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


# User Authentication Serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'display_name', 'avatar_url', 'plan', 'email_notifications', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'display_name', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password.")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
            data['user'] = user
        else:
            raise serializers.ValidationError("Email and password are required.")
        
        return data


# Domain Management Serializers

class SavedDomainSerializer(serializers.ModelSerializer):
    full_domain = serializers.ReadOnlyField()

    class Meta:
        model = SavedDomain
        fields = ['id', 'domain_name', 'tld', 'is_available', 'price', 'registrar', 'notes', 'full_domain', 'created_at']
        read_only_fields = ['id', 'created_at']


class DomainListSerializer(serializers.ModelSerializer):
    domains = SavedDomainSerializer(many=True, read_only=True)
    domain_count = serializers.SerializerMethodField()

    class Meta:
        model = DomainList
        fields = ['id', 'name', 'description', 'is_public', 'domains', 'domain_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_domain_count(self, obj):
        return obj.domains.count()


class DomainWatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = DomainWatchlist
        fields = ['id', 'domain_name', 'watch_type', 'target_price', 'last_checked', 'last_status', 'is_active', 'created_at']
        read_only_fields = ['id', 'last_checked', 'last_status', 'created_at']


class DomainAlertSerializer(serializers.ModelSerializer):
    watchlist_domain = serializers.CharField(source='watchlist.domain_name', read_only=True)

    class Meta:
        model = DomainAlert
        fields = ['id', 'alert_type', 'message', 'old_value', 'new_value', 'is_read', 'watchlist_domain', 'created_at']
        read_only_fields = ['id', 'created_at']


class ListShareSerializer(serializers.ModelSerializer):
    shared_with_email = serializers.CharField(source='shared_with.email', read_only=True)
    domain_list_name = serializers.CharField(source='domain_list.name', read_only=True)

    class Meta:
        model = ListShare
        fields = ['id', 'domain_list', 'shared_with', 'shared_with_email', 'domain_list_name', 'permission', 'created_at']
        read_only_fields = ['id', 'created_at']
