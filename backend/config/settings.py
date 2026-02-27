import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-change-me-in-production')

DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///db.sqlite3")
DATABASES = {"default": dj_database_url.parse(DATABASE_URL)}

# No cache — stateless DNS checks

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/minute',
    },
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'api.User'

CORS_ALLOW_ALL_ORIGINS = True

# CSRF
CSRF_TRUSTED_ORIGINS = [
    f"https://{origin.strip()}"
    for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "backend-production-4d81.up.railway.app,api.domydomains.com").split(",")
    if origin.strip()
]

# Domain search config
# Fast search — 23 popular TLDs for instant results
POPULAR_TLDS = [
    'com', 'net', 'org', 'io', 'ai', 'dev', 'app', 'co', 'me', 'xyz',
    'tech', 'info', 'biz', 'cloud', 'design', 'blog', 'shop', 'site',
    'store', 'online', 'gg', 'cc', 'tv',
]

# Full list — 400+ TLDs for Extensions tab
DOMAIN_TLDS = [
    'com', 'net', 'org', 'info', 'biz', 'name', 'mobi', 'pro', 'tel',
    'co', 'io', 'ai', 'me', 'cc', 'tv', 'us', 'uk', 'ca', 'de', 'fr',
    'nl', 'eu', 'au', 'nz', 'jp', 'kr', 'in', 'br', 'mx', 'ar', 'za',
    'se', 'no', 'dk', 'fi', 'pl', 'cz', 'at', 'ch', 'be', 'it', 'es',
    'pt', 'ie', 'ru', 'il', 'sg', 'hk', 'tw', 'ph', 'th', 'id', 'my',
    'ae', 'sa', 'tr', 'gr', 'ro', 'hu', 'bg', 'hr', 'sk', 'lt', 'lv',
    'ee', 'is', 'lu', 'si', 'cy',
    'dev', 'app', 'tech', 'cloud', 'code', 'software', 'systems', 'digital',
    'network', 'computer', 'technology', 'engineering', 'data', 'hosting',
    'company', 'business', 'agency', 'solutions', 'services', 'consulting',
    'ventures', 'enterprise', 'partners', 'group', 'inc', 'ltd', 'corp',
    'industries', 'holdings', 'capital', 'investments', 'financial', 'finance',
    'management', 'marketing', 'careers', 'jobs', 'work', 'team', 'office',
    'design', 'studio', 'media', 'art', 'photography', 'photo', 'gallery',
    'graphics', 'creative', 'film', 'music', 'video', 'game', 'games',
    'site', 'online', 'website', 'page', 'web', 'link', 'click', 'host',
    'space', 'zone', 'land', 'world', 'global', 'international', 'wiki',
    'store', 'shop', 'market', 'buy', 'sale', 'deals', 'discount',
    'shopping', 'boutique', 'luxury', 'premium', 'auction',
    'fashion', 'shoes', 'jewelry', 'gifts', 'flowers',
    'restaurant', 'bar', 'cafe', 'coffee', 'pizza', 'beer', 'wine',
    'recipes', 'cooking', 'kitchen', 'organic', 'farm', 'garden',
    'xyz', 'gg', 'lol', 'wtf', 'cool', 'fun', 'vip', 'club', 'one',
    'top', 'best', 'new', 'now', 'today', 'life', 'style', 'rocks',
    'ninja', 'guru', 'expert', 'plus', 'tips', 'review', 'fail',
    'blog', 'news', 'live', 'stream', 'press', 'social', 'chat',
    'email', 'forum', 'community',
    'academy', 'school', 'university', 'education', 'training', 'courses',
    'science', 'research', 'institute', 'college',
    'health', 'healthcare', 'dental', 'doctor', 'clinic', 'hospital',
    'pharmacy', 'fitness', 'yoga', 'diet', 'wellness', 'care',
    'house', 'homes', 'property', 'realty', 'estate', 'apartments',
    'mortgage', 'rent', 'construction', 'build',
    'travel', 'tours', 'holiday', 'flights', 'hotel', 'resort', 'cruise',
    'taxi', 'city', 'town', 'place', 'country',
    'car', 'cars', 'auto', 'motorcycle', 'bike', 'boat', 'racing',
    'law', 'legal', 'attorney', 'lawyer', 'tax', 'insurance',
    'church', 'faith',
    'sport', 'football', 'soccer', 'basketball', 'golf', 'tennis',
    'hockey', 'cricket', 'fishing', 'camp', 'ski',
    'pet', 'dog', 'cat', 'vet',
    'cleaning', 'moving', 'storage', 'security', 'delivery', 'salon', 'spa',
    'money', 'cash', 'gold', 'bitcoin', 'crypto', 'exchange', 'trade',
    'forex', 'fund', 'bank', 'credit', 'loan', 'pay',
    'green', 'eco', 'solar', 'energy', 'bio', 'nature',
    'black', 'red', 'blue', 'pink', 'purple', 'orange',
    'startup', 'labs', 'works', 'supply', 'tools', 'foundation',
    'charity', 'nonprofit', 'radio', 'podcast', 'show', 'channel',
    'download', 'support', 'help', 'guide',
]
