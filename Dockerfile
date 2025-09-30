# Imagem oficial do Python 3.11 slim (leve)
FROM python:3.11-slim

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários (respeita .dockerignore)
COPY . /app

# Atualiza pip e instala dependências
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Comando para rodar a aplicação
CMD ["gunicorn", "app:create_app", "--bind", "0.0.0.0:8000", "--workers", "4"]