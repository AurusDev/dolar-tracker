FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Render define $PORT; usamos 1 worker p/ evitar múltiplos schedulers
CMD ["sh", "-c", "gunicorn -w 1 -b 0.0.0.0:${PORT:-5000} app:app"]
