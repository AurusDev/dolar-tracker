from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from pytz import timezone
from sqlalchemy import select
from sqlalchemy.orm import Session
from config import settings
from database import SessionLocal
from models import Rate
from price_service import get_usd_brl_rate

def fetch_and_store():
    with SessionLocal() as db:  # type: Session
        last = db.execute(select(Rate).order_by(Rate.id.desc())).scalars().first()
        last_val = last.price if last else None
        price = get_usd_brl_rate(fallback=last_val)
        if last_val is None or abs(price - last_val) >= 0.0001:
            db.add(Rate(price=price))
            db.commit()

def start_scheduler():
    sched = BackgroundScheduler(timezone=timezone(settings.TIMEZONE))
    trig = IntervalTrigger(minutes=settings.FETCH_INTERVAL_MINUTES)
    sched.add_job(fetch_and_store, trig, id="fetch_rate", replace_existing=True, max_instances=1, coalesce=True)
    sched.start()
    return sched
