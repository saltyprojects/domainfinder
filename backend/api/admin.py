from django.contrib import admin
from .models import User, SEOArticle, DomainList, SavedDomain, DomainWatchlist, DomainAlert, ListShare


@admin.register(SEOArticle)
class SEOArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'status', 'published_date', 'backlink_url')
    list_filter = ('platform', 'status')
    search_fields = ('title', 'target_keywords', 'content_summary')
    list_editable = ('status',)
    ordering = ('-published_date',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser', 'plan', 'created_at')
    list_filter = ('is_staff', 'plan')
    search_fields = ('username', 'email')


@admin.register(DomainList)
class DomainListAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')


@admin.register(SavedDomain)
class SavedDomainAdmin(admin.ModelAdmin):
    list_display = ('full_domain', 'tld', 'available', 'domain_list')
    list_filter = ('available', 'tld')


@admin.register(DomainWatchlist)
class DomainWatchlistAdmin(admin.ModelAdmin):
    list_display = ('domain', 'user', 'notify_available', 'created_at')


@admin.register(DomainAlert)
class DomainAlertAdmin(admin.ModelAdmin):
    list_display = ('domain', 'user', 'alert_type', 'is_active')
    list_filter = ('alert_type', 'is_active')
