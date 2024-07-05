# path: stock_fight/app/config.py

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    finnhub_api_key: str = Field(..., env="FINNHUB_API_KEY")
    alpha_vantage_api_key: str = Field(..., env="ALPHA_VANTAGE_API_KEY")
    redis_url: str = Field(..., env="REDIS_URL")
    redis_ttl: int = 3600  # default to 1 hour

    class Config:
        env_file = ".env"


settings = Settings()
