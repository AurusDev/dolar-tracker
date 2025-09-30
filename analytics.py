from datetime import datetime, timedelta
from statistics import mean
from typing import List, Dict

def slice_last_days(series: List[Dict], days: int) -> List[Dict]:
    if not series:
        return []
    tz = series[-1]["t"].tzinfo
    cutoff = datetime.now(tz) - timedelta(days=days)
    return [p for p in series if p["t"] >= cutoff]

def compute_stats(series: List[Dict]) -> Dict:
    if not series:
        return {"last": None, "min": None, "max": None, "mean": None, "ma7": None, "change_pct": None}
    vals = [p["v"] for p in series]
    last = vals[-1]
    ma7 = mean(vals[-7:]) if len(vals) >= 7 else mean(vals)
    first = vals[0]
    change_pct = None if first == 0 else ((last - first) / first) * 100
    return {
        "last": last,
        "min": min(vals),
        "max": max(vals),
        "mean": mean(vals),
        "ma7": ma7,
        "change_pct": change_pct,
    }
