import statistics
from datetime import datetime, timedelta

def slice_last_days(series, days):
    cutoff = datetime.now() - timedelta(days=days)
    return [p for p in series if p["t"] >= cutoff]

def compute_stats(series):
    if not series:
        return {"count": 0, "min": None, "max": None, "avg": None}

    values = [p["v"] for p in series]
    return {
        "count": len(values),
        "min": min(values),
        "max": max(values),
        "avg": statistics.mean(values),
    }
