from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator, EmailValidator
from decimal import Decimal


class User(AbstractUser):
    """Extended user model with DomyDomains-specific fields."""
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    display_name = models.CharField(max_length=100, blank=True)
    avatar_url = models.URLField(blank=True, validators=[URLValidator()])
    plan = models.CharField(
        max_length=20,
        choices=[
            ('FREE', 'Free'),
            ('PRO', 'Pro'),
        ],
        default='FREE'
    )
    email_notifications = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class DomainList(models.Model):
    """User-created lists of domains."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='domain_lists')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'name']

    def __str__(self):
        return f"{self.user.email} - {self.name}"


class SavedDomain(models.Model):
    """Individual domains saved by users."""
    domain_list = models.ForeignKey(DomainList, on_delete=models.CASCADE, related_name='domains')
    domain_name = models.CharField(max_length=255)  # e.g., "mysite.com"
    tld = models.CharField(max_length=20)  # e.g., "com"
    is_available = models.BooleanField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    registrar = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['domain_list', 'domain_name']

    def __str__(self):
        return f"{self.domain_name} in {self.domain_list.name}"

    @property
    def full_domain(self):
        """Return the full domain name."""
        return f"{self.domain_name.split('.')[0]}.{self.tld}"


class DomainWatchlist(models.Model):
    """Watchlist for domain availability and price changes."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlists')
    domain_name = models.CharField(max_length=255)  # e.g., "example.com"
    watch_type = models.CharField(
        max_length=20,
        choices=[
            ('AVAILABILITY', 'Availability Change'),
            ('PRICE_DROP', 'Price Drop'),
            ('EXPIRY', 'Expiration Date'),
        ]
    )
    target_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Alert when price drops below this amount"
    )
    last_checked = models.DateTimeField(null=True, blank=True)
    last_status = models.JSONField(default=dict, blank=True)  # Store last known state
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'domain_name', 'watch_type']

    def __str__(self):
        return f"{self.user.email} watching {self.domain_name} for {self.watch_type}"


class DomainAlert(models.Model):
    """Alerts generated from watchlists."""
    watchlist = models.ForeignKey(DomainWatchlist, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(
        max_length=20,
        choices=[
            ('AVAILABLE', 'Domain Available'),
            ('PRICE_DROP', 'Price Dropped'),
            ('EXPIRING', 'Domain Expiring'),
        ]
    )
    message = models.TextField()
    old_value = models.CharField(max_length=255, blank=True)
    new_value = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Alert for {self.watchlist.domain_name}: {self.alert_type}"


class ListShare(models.Model):
    """Share domain lists with other users."""
    domain_list = models.ForeignKey(DomainList, on_delete=models.CASCADE, related_name='shares')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_lists')
    permission = models.CharField(
        max_length=10,
        choices=[
            ('VIEW', 'View Only'),
            ('EDIT', 'Edit'),
        ],
        default='VIEW'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['domain_list', 'shared_with']

    def __str__(self):
        return f"{self.domain_list.name} shared with {self.shared_with.email}"


class SEOArticle(models.Model):
    """Track published SEO articles with backlinks to domydomains.com."""
    PLATFORM_CHOICES = [
        ('medium', 'Medium'),
        ('devto', 'Dev.to'),
        ('hashnode', 'Hashnode'),
        ('linkedin', 'LinkedIn'),
        ('wordpress', 'WordPress'),
        ('substack', 'Substack'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('indexed', 'Indexed by Google'),
    ]
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True)
    url = models.URLField(max_length=500, blank=True)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    backlink_url = models.URLField(max_length=500, default='https://domydomains.com', help_text='The domydomains.com URL this article links to')
    backlink_anchor = models.CharField(max_length=200, default='DomyDomains', help_text='Anchor text for the backlink')
    content_summary = models.TextField(blank=True, help_text='Brief summary of article content')
    target_keywords = models.CharField(max_length=500, blank=True, help_text='Comma-separated target keywords')
    published_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']

    def __str__(self):
        return f"[{self.platform}] {self.title} ({self.status})"