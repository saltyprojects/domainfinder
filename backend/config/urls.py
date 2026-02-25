from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import DomainSearchViewSet, SuggestionsViewSet, WhoisViewSet, linkedin_callback, search_stream, social_whois_stream

router = DefaultRouter()
router.register(r'search', DomainSearchViewSet, basename='search')
router.register(r'suggestions', SuggestionsViewSet, basename='suggestions')
router.register(r'whois', WhoisViewSet, basename='whois')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/search/stream/', search_stream, name='search-stream'),
    path('api/social-whois/stream/', social_whois_stream, name='social-whois-stream'),
    path('api/linkedin/callback/', linkedin_callback, name='linkedin-callback'),
    path('api/', include(router.urls)),
]
