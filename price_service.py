import requests

def get_usd_brl_rate(fallback=None):
    try:
        resp = requests.get("https://api.exchangerate.host/latest?base=USD&symbols=BRL", timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return data["rates"]["BRL"]
    except Exception:
        return fallback if fallback is not None else 0.0
