from datetime import datetime, timedelta
from statistics import mean
from typing import Dict, List

def compute_stats(series: List[Dict]) -> Dict:
    """
    series: lista de dicts [{ 't': datetime, 'v': float }, ...]
    """
    if not series:
        return {}

    values = [p["v"] for p in series]
    last = values[-1]
    first = values[0]

    window = values[-7:] if len(values) >= 7 else values
    ma7 = mean(window)

    change_pct = None
    if first != 0:
        change_pct = ((last - first) / first) * 100

    return {
        "last": last,
        "min": min(values),
        "max": max(values),
        "mean": mean(values),
        "ma7": ma7,
        "change_pct": change_pct,
        "count": len(values),
        "from": series[0]["t"].isoformat(),
        "to": series[-1]["t"].isoformat(),
    }

def slice_last_days(series: List[Dict], days: int) -> List[Dict]:
    if not series:
        return []
    dt_from = datetime.now(series[-1]["t"].tzinfo) - timedelta(days=days)
    return [p for p in series if p["t"] >= dt_from]
