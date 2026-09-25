import os
from dataclasses import dataclass
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default

@dataclass(frozen=True)
class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    TENANT_API_KEY: str = os.getenv("TENANT_API_KEY", "")
    TIENDANUBE_APP_SECRET: str = os.getenv("TIENDANUBE_APP_SECRET", "")
    ENV: str = os.getenv("ENV", "dev")

    RATE_LIMIT_INGEST_PER_MIN: int = _int("RATE_LIMIT_INGEST_PER_MIN", 60)
    RATE_LIMIT_WEBHOOK_PER_MIN: int = _int("RATE_LIMIT_WEBHOOK_PER_MIN", 120)

settings = Settings()

