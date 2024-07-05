# path: stock_fight/app/redis_cache.py

from redis.asyncio import Redis

from .config import settings

redis = Redis.from_url(settings.redis_url, decode_responses=True)
