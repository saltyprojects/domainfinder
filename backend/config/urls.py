from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    DomainSearchViewSet, SuggestionsViewSet, WhoisViewSet, TrademarkViewSet, 
    SocialContentViewSet, DomainListViewSet, DomainWatchlistViewSet, DomainAlertViewSet,
    linkedin_callback, search_stream, social_whois_stream, preview_content,
    register, login_view, logout_view, user_dashboard,
    expiring_domains, expiring_domains_by_urgency, domain_expiry_info
)

router = DefaultRouter()
router.register(r'search', DomainSearchViewSet, basename='search')
router.register(r'suggestions', SuggestionsViewSet, basename='suggestions')
router.register(r'whois', WhoisViewSet, basename='whois')
router.register(r'trademark', TrademarkViewSet, basename='trademark')
router.register(r'social-content', SocialContentViewSet, basename='social-content')
router.register(r'domain-lists', DomainListViewSet, basename='domain-lists')
router.register(r'watchlist', DomainWatchlistViewSet, basename='watchlist')
router.register(r'alerts', DomainAlertViewSet, basename='alerts')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/search/stream/', search_stream, name='search-stream'),
    path('api/social-whois/stream/', social_whois_stream, name='social-whois-stream'),
    path('api/content/preview/', preview_content, name='preview-content'),
    path('api/linkedin/callback/', linkedin_callback, name='linkedin-callback'),
    path('api/auth/register/', register, name='register'),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/logout/', logout_view, name='logout'),
    path('api/dashboard/', user_dashboard, name='user-dashboard'),
    path('api/expiring-domains/', expiring_domains, name='expiring-domains'),
    path('api/expiring-domains/by-urgency/', expiring_domains_by_urgency, name='expiring-domains-by-urgency'),
    path('api/domain-expiry/', domain_expiry_info, name='domain-expiry-info'),
    path('api/', include(router.urls)),
]
