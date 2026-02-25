from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import DomainSearchViewSet

router = DefaultRouter()
router.register(r'search', DomainSearchViewSet, basename='search')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
