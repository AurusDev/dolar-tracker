from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from pytz import timezone
from sqlalchemy import select
from sqlalchemy.orm import Session

from config import settings
from database import SessionLocal
from models import Rate
from price_service import get_usd_brl_rate


def _fetch_and_store():
    with SessionLocal() as db:  # type: Session
        last = db.execute(select(Rate).order_by(Rate.id.desc())).scalars().first()
        last_val = last.price if last else None
        price = get_usd_brl_rate(fallback=last_val)
        if last_val is None or abs(price - last_val) >= 0.0001:
            db.add(Rate(price=price))
            db.commit()

_scheduler = None

def start_scheduler():
    global _scheduler
    if _scheduler is not None:
        return _scheduler
    tz = timezone(settings.TIMEZONE)
    sched = BackgroundScheduler(timezone=tz, daemon=True)
    sched.add_job(_fetch_and_store, IntervalTrigger(minutes=settings.FETCH_INTERVAL_MINUTES), id="fetch_rate", replace_existing=True, coalesce=True, max_instances=1)
    sched.start()
    _fetch_and_store()  # coleta imediata na subida
    _scheduler = sched
    return sched
