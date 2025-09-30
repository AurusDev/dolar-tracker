from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import settings

def normalize_db_url(url: str) -> str:
    # Render costuma dar postgres://; SQLAlchemy pede postgresql+psycopg2://
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url

DB_URL = normalize_db_url(settings.DATABASE_URL)

engine = create_engine(
    DB_URL,
    future=True,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
