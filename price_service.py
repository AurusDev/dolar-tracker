import requests
from typing import Optional

DEFAULT_TIMEOUT = 10

def fetch_exchangerate_host() -> float:
    url = "https://api.exchangerate.host/latest?base=USD&symbols=BRL"
    r = requests.get(url, timeout=DEFAULT_TIMEOUT)
    r.raise_for_status()
    return float(r.json()["rates"]["BRL"])

def fetch_awesomeapi() -> float:
    url = "https://economia.awesomeapi.com.br/json/last/USD-BRL"
    r = requests.get(url, timeout=DEFAULT_TIMEOUT)
    r.raise_for_status()
    return float(r.json()["USDBRL"]["bid"])

def get_usd_brl_rate(fallback: Optional[float] = None) -> float:
    for fn in (fetch_exchangerate_host, fetch_awesomeapi):
        try:
            return fn()
        except Exception:
            continue
    if fallback is not None:
        return fallback
    raise RuntimeError("Falha ao obter cotação USD/BRL em todas as fontes.")
