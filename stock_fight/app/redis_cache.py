# stock_fight/app/redis_cache.py

import os

from redis.asyncio import Redis

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

redis = Redis.from_url(redis_url, decode_responses=True)
