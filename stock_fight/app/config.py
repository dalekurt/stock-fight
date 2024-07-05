# path: stock_fight/app/config.py

from pydantic import BaseSettings


class Settings(BaseSettings):
    finnhub_api_key: str
    alpha_vantage_api_key: str
    redis_url: str
    redis_ttl: int = 3600  # default to 1 hour

    class Config:
        env_file = ".env"


settings = Settings()
