from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import DomainSearchViewSet, SuggestionsViewSet, WhoisViewSet, TrademarkViewSet, SocialContentViewSet, linkedin_callback, search_stream, social_whois_stream, preview_content

router = DefaultRouter()
router.register(r'search', DomainSearchViewSet, basename='search')
router.register(r'suggestions', SuggestionsViewSet, basename='suggestions')
router.register(r'whois', WhoisViewSet, basename='whois')
router.register(r'trademark', TrademarkViewSet, basename='trademark')
router.register(r'social-content', SocialContentViewSet, basename='social-content')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/search/stream/', search_stream, name='search-stream'),
    path('api/social-whois/stream/', social_whois_stream, name='social-whois-stream'),
    path('api/content/preview/', preview_content, name='preview-content'),
    path('api/linkedin/callback/', linkedin_callback, name='linkedin-callback'),
    path('api/', include(router.urls)),
]
