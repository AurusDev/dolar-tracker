from flask import Flask, render_template, jsonify, request
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone as dt_tz
from config import settings
from database import SessionLocal, engine
from models import Base, Rate
from analytics import compute_stats, slice_last_days
from price_service import get_usd_brl_rate
from scheduler import start_scheduler

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = settings.SECRET_KEY

    # cria tabelas
    Base.metadata.create_all(bind=engine)

    # inicia scheduler
    start_scheduler()

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/api/rate", methods=["GET"])
    def api_rate():
        with SessionLocal() as db:  # type: Session
            row = db.execute(select(Rate).order_by(Rate.id.desc())).scalars().first()
            if row:
                return jsonify({"price": row.price, "at": row.created_at.isoformat()})
            # se não houver, busca agora e salva
            price = get_usd_brl_rate()
            db.add(Rate(price=price))
            db.commit()
            return jsonify({"price": price, "at": datetime.now(dt_tz.utc).isoformat()})

    @app.route("/api/refresh", methods=["POST"])
    def api_refresh():
        with SessionLocal() as db:  # type: Session
            last = db.execute(select(Rate).order_by(Rate.id.desc())).scalars().first()
            last_val = last.price if last else None
            price = get_usd_brl_rate(fallback=last_val)
            if last_val is None or abs(price - last_val) >= 0.0001:
                db.add(Rate(price=price))
                db.commit()
            return jsonify({"price": price})

    @app.route("/api/history", methods=["GET"])
    def api_history():
        days = int(request.args.get("days", "30"))
        with SessionLocal() as db:
            rows = db.execute(
                select(Rate).order_by(Rate.created_at.asc())
            ).scalars().all()
            series = [{"t": r.created_at, "v": r.price} for r in rows]
            series = slice_last_days(series, days)
            return jsonify([
                {"t": p["t"].isoformat(), "v": p["v"]} for p in series
            ])

    @app.route("/api/stats", methods=["GET"])
    def api_stats():
        days = int(request.args.get("days", "30"))
        with SessionLocal() as db:
            rows = db.execute(
                select(Rate).order_by(Rate.created_at.asc())
            ).scalars().all()
            series = [{"t": r.created_at, "v": r.price} for r in rows]
            series = slice_last_days(series, days)
            return jsonify(compute_stats(series))

    @app.route("/api/health", methods=["GET"])
    def api_health():
        # simples healthcheck
        with SessionLocal() as db:
            count = db.execute(select(func.count(Rate.id))).scalar_one()
        return jsonify({"ok": True, "rows": count})

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
