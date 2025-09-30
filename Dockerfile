# Usa imagem oficial do Python
FROM python:3.11-slim

# Define pasta de trabalho
WORKDIR /app

# Copia requirements e instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Expõe a porta esperada pelo Render
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
