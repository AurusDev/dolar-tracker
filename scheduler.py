from apscheduler.schedulers.background import BackgroundScheduler
from database import SessionLocal
from models import Rate
from price_service import get_usd_brl_rate
from datetime import datetime, timezone
from config import settings

def fetch_and_store():
    with SessionLocal() as db:
        last = db.query(Rate).order_by(Rate.id.desc()).first()
        last_val = last.price if last else None
        price = get_usd_brl_rate(fallback=last_val)
        if last_val is None or abs(price - last_val) >= 0.0001:
            db.add(Rate(price=price, created_at=datetime.now(timezone.utc)))
            db.commit()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(fetch_and_store, "interval", minutes=settings.FETCH_INTERVAL_MINUTES)
    scheduler.start()
