import os

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./usdbrl.db")
    FETCH_INTERVAL_MINUTES: int = int(os.getenv("FETCH_INTERVAL_MINUTES", "30"))
    TIMEZONE: str = os.getenv("TIMEZONE", "UTC")
    ASSET_VERSION: str = os.getenv("ASSET_VERSION", "1")  # cache bust

settings = Settings()
