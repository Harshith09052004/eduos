#!/bin/bash
python manage.py migrate --noinput
python manage.py seed_data
gunicorn config.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120
