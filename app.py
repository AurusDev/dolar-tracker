from flask import Flask, render_template, jsonify, request
from config import settings
from database import init_db, get_session
from models import Price
from analytics import calculate_stats

def create_app():
    app = Flask(__name__)
    init_db()

    @app.route("/")
    def index():
        return render_template("index.html", asset_version=settings.ASSET_VERSION)

    @app.route("/api/rate")
    def rate():
        with get_session() as db:
            last = db.query(Price).order_by(Price.timestamp.desc()).first()
            if not last:
                return jsonify({"error": "No data"}), 404
            return jsonify({"price": last.value, "at": last.timestamp.isoformat()})

    @app.route("/api/history")
    def history():
        days = int(request.args.get("days", 30))
        with get_session() as db:
            q = db.query(Price).order_by(Price.timestamp.asc()).all()
            data = [{"t": p.timestamp.isoformat(), "v": p.value} for p in q[-days:]]
            return jsonify(data)

    @app.route("/api/stats")
    def stats():
        days = int(request.args.get("days", 30))
        with get_session() as db:
            q = db.query(Price).order_by(Price.timestamp.asc()).all()
            data = [p.value for p in q[-days:]]
            return jsonify(calculate_stats(data))

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
