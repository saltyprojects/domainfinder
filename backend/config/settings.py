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
    for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "backend-production-4d81.up.railway.app").split(",")
    if origin.strip()
]

# Domain search config
DOMAIN_TLDS = [
    # Top-level
    'com', 'net', 'org', 'info', 'biz',
    # Country codes
    'co', 'io', 'ai', 'me', 'cc', 'tv', 'us', 'uk', 'ca', 'de',
    # Tech
    'dev', 'app', 'tech', 'cloud', 'code', 'software', 'systems', 'digital', 'network',
    # Business
    'company', 'business', 'agency', 'solutions', 'services', 'consulting', 'ventures',
    # Creative
    'design', 'studio', 'media', 'art', 'photography',
    # Web
    'site', 'online', 'website', 'page', 'web',
    # Commerce
    'store', 'shop', 'market', 'buy', 'sale', 'deals', 'discount',
    # Modern
    'xyz', 'gg', 'lol', 'wtf', 'cool', 'fun', 'vip', 'club', 'one', 'top', 'best', 'new',
    # Blog/Content
    'blog', 'news', 'live', 'tv', 'video',
    # Professional
    'pro', 'expert', 'guru', 'academy', 'institute',
    # Startup
    'startup', 'inc', 'ltd', 'group', 'team', 'labs', 'works',
]
