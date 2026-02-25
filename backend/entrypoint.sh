#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput 2>&1 || {
    echo "Migration failed — resetting migration history..."
    python manage.py migrate --fake-initial --noinput 2>&1 || {
        echo "Fake initial failed — flushing DB and re-migrating..."
        python -c "
import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
print('DB reset.')
"
        python manage.py migrate --noinput
    }
}
echo "Migrations complete."

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
