from django.contrib import admin
from .models import User, SEOArticle


@admin.register(SEOArticle)
class SEOArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'status', 'published_date', 'backlink_url')
    list_filter = ('platform', 'status')
    search_fields = ('title', 'target_keywords', 'content_summary')
    list_editable = ('status',)
    ordering = ('-published_date',)
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'url', 'platform', 'status')}),
        ('Content', {'fields': ('body', 'content_summary', 'target_keywords')}),
        ('Backlink', {'fields': ('backlink_url', 'backlink_anchor')}),
        ('Dates', {'fields': ('published_date',)}),
    )


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser', 'plan', 'created_at')
    list_filter = ('is_staff', 'plan')
    search_fields = ('username', 'email')
