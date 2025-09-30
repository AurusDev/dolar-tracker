# Usa Python slim
FROM python:3.11-slim

# Define diretório de trabalho
WORKDIR /app

# Copia dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código
COPY . .

# Expõe a porta
EXPOSE 8000

# Start do servidor
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT} --workers 4"]

