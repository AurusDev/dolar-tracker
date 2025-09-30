import requests
from typing import Optional

DEFAULT_TIMEOUT = 10

def fetch_exchangerate_host() -> Optional[float]:
    # USD->BRL
    url = "https://api.exchangerate.host/latest?base=USD&symbols=BRL"
    r = requests.get(url, timeout=DEFAULT_TIMEOUT)
    r.raise_for_status()
    data = r.json()
    return float(data["rates"]["BRL"])

def fetch_awesomeapi() -> Optional[float]:
    url = "https://economia.awesomeapi.com.br/json/last/USD-BRL"
    r = requests.get(url, timeout=DEFAULT_TIMEOUT)
    r.raise_for_status()
    data = r.json()
    # campo "USDBRL" -> "bid"
    return float(data["USDBRL"]["bid"])

def get_usd_brl_rate(fallback: Optional[float] = None) -> float:
    """
    Tenta múltiplas fontes. Se tudo falhar, retorna fallback (se houver) ou dispara exceção.
    """
    errors = []
    for fn in (fetch_exchangerate_host, fetch_awesomeapi):
        try:
            return fn()
        except Exception as e:
            errors.append(str(e))

    if fallback is not None:
        return fallback

    raise RuntimeError(f"Falha ao obter cotação USD/BRL. Erros: {errors}")
