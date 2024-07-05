# stock_fight/app/redis_cache.py

from redis.asyncio import Redis

from .config import settings

redis = Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    db=settings.redis_db,
    decode_responses=True,
)
