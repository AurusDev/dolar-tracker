# 💵 Dólar Tracker

[![Python](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/release/python-3130/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aplicativo **Flask** para rastrear a **cotação do dólar (USD/BRL)** em tempo real, com:

- 📊 **Dashboard moderno** (dark theme + glassmorphism)  
- 🔄 **Atualização manual e automática**  
- ⏱️ **Scheduler** para coleta periódica  
- 🗄️ **Histórico** salvo em banco de dados  
- 📈 **Gráficos interativos** (Chart.js)  
- 📉 **Análises estatísticas** (média, min, max, variação, MM7)  
- 🖼️ **UI elegante** com hover effects e favicon customizado  

---

## 🚀 Tecnologias

- [Flask](https://flask.palletsprojects.com/)  
- [SQLAlchemy](https://www.sqlalchemy.org/)  
- [APScheduler](https://apscheduler.readthedocs.io/)  
- [Chart.js](https://www.chartjs.org/)  
- HTML, CSS (dark + glassmorphism), JavaScript

---

## ⚙️ Instalação local

```bash
git clone https://github.com/arthurmonteiro-dev/dolar-tracker.git
cd dolar-tracker

# criar ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# instalar dependências
pip install -r requirements.txt

# rodar app
python app.py
```

Acesse em: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🌍 Deploy no Render

O app está pronto para ser publicado no [Render](https://render.com/).

**Start Command**  
```bash
gunicorn app:create_app --bind 0.0.0.0:$PORT --workers 4
```

**Variáveis de ambiente**

- `SECRET_KEY` → chave secreta  
- `FETCH_INTERVAL_MINUTES` → intervalo de atualização (padrão: 30)  
- `TIMEZONE` → timezone (ex: America/Sao_Paulo)  

---

## 📜 Licença

Distribuído sob a licença MIT. Veja o arquivo [`LICENSE`](LICENSE) para mais detalhes.

---

## ✨ Créditos

Developed by **Arthur Monteiro**
