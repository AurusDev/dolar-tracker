import requests

TIMEOUT = 10

def _exchangerate_host() -> float:
    r = requests.get("https://api.exchangerate.host/latest?base=USD&symbols=BRL", timeout=TIMEOUT)
    r.raise_for_status()
    return float(r.json()["rates"]["BRL"])

def _awesomeapi() -> float:
    r = requests.get("https://economia.awesomeapi.com.br/json/last/USD-BRL", timeout=TIMEOUT)
    r.raise_for_status()
    return float(r.json()["USDBRL"]["bid"])

def get_usd_brl_rate(fallback=None) -> float:
    for fn in (_exchangerate_host, _awesomeapi):
        try:
            return fn()
        except Exception:
            continue
    if fallback is not None:
        return fallback
    raise RuntimeError("Falha ao obter cotação USD/BRL.")
