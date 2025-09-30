FROM python:3.11-slim

WORKDIR /app

# evita buffering nos logs
ENV PYTHONUNBUFFERED=1

# instalar dependências do sistema (necessárias pro psycopg2)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "gunicorn 'app:create_app()' --bind 0.0.0.0:${PORT} --workers 4"]
