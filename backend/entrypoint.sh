#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput 2>&1 || {
    echo "Migration failed — resetting migration history..."
    python manage.py migrate --fake-initial --noinput 2>&1 || {
        echo "Fake initial also failed — NOT dropping DB (data safety). Manual intervention needed."
        exit 1
    }
}
echo "Migrations complete."

echo "Creating superuser if needed..."
python -c "
import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'root')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@domydomains.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'changeme')
if not User.objects.filter(username=username).exists():
    user = User(username=username, email=email, is_staff=True, is_superuser=True, is_active=True)
    user.set_password(password)
    user.save()
    print(f'Superuser created: {username}')
else:
    print(f'Superuser exists: {username}')
" 2>&1 || true

echo "Seeding data..."
python manage.py seed || true
echo "Seed complete."

echo "PORT=${PORT:-not set}"
echo "Starting gunicorn..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers 2 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile - \
    --capture-output
