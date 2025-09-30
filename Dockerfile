# Python 3.11 (garantido)
FROM python:3.11-slim

WORKDIR /app
COPY . /app

# Dependências
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Inicia Gunicorn usando a Factory do Flask
# Usa a variável $PORT do Render (ou 8000 localmente)
CMD ["sh", "-c", "gunicorn --factory app:create_app --bind 0.0.0.0:${PORT:-8000} --workers 2"]
