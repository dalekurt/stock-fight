# path: backend/stock_fight/app/main.py

import json
import logging
import time
from datetime import datetime, timedelta

import httpx
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from .config import settings
from .redis_cache import redis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RETRY_INTERVAL = 5  # seconds
MAX_RETRIES = 12  # will wait for 1 minute before failing


async def check_redis_connection():
    retries = 0
    while retries < MAX_RETRIES:
        try:
            await redis.ping()
            logging.info("Connected to Redis")
            return
        except Exception as e:
            logging.error(f"Redis connection failed: {e}")
            retries += 1
            time.sleep(RETRY_INTERVAL)
    raise HTTPException(status_code=500, detail="Cannot connect to Redis")


@app.on_event("startup")
async def startup_event():
    logging.info("Starting up...")
    await check_redis_connection()
    logging.info("Startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    logging.info("Shutting down...")
    await redis.close()
    logging.info("Shutdown complete")


@app.get("/healthz")
async def health_check():
    try:
        await redis.ping()
        return JSONResponse(status_code=200, content={"status": "ok"})
    except Exception as e:
        logging.error(f"Health check failed: {e}")
        return JSONResponse(status_code=500, content={"status": "unhealthy"})


async def get_company_profile(symbol: str):
    profile_url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={settings.finnhub_api_key}"
    async with httpx.AsyncClient() as client:
        profile_response = await client.get(profile_url)
    if profile_response.status_code != 200:
        logging.error(
            f"Error fetching company profile for {symbol}: {profile_response.text}"
        )
        raise HTTPException(
            status_code=400, detail="Error fetching company profile from Finnhub"
        )
    logging.info(f"Fetched company profile for {symbol}: {profile_response.json()}")
    return profile_response.json()


async def get_stock_data(symbol: str):
    try:
        # Fetching stock quote
        quote_url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={settings.finnhub_api_key}"
        async with httpx.AsyncClient() as client:
            quote_response = await client.get(quote_url)
            if quote_response.status_code != 200:
                logging.error(
                    f"Error fetching quote for {symbol}: {quote_response.text}"
                )
                raise HTTPException(
                    status_code=400, detail="Error fetching quote from Finnhub"
                )
            quote_data = quote_response.json()

        # Fetching stock fundamentals
        fundamental_url = f"https://finnhub.io/api/v1/stock/metric?symbol={symbol}&metric=all&token={settings.finnhub_api_key}"
        async with httpx.AsyncClient() as client:
            fundamental_response = await client.get(fundamental_url)
            if fundamental_response.status_code != 200:
                logging.error(
                    f"Error fetching fundamentals for {symbol}: {fundamental_response.text}"
                )
                raise HTTPException(
                    status_code=400, detail="Error fetching fundamentals from Finnhub"
                )
            fundamental_data = fundamental_response.json()

        # Fetching company profile
        profile_data = await get_company_profile(symbol)

        data = {
            "quote": quote_data,
            "fundamentals": fundamental_data,
            "profile": profile_data,
        }

        logging.info(f"Fetched data for {symbol}: {data}")
        return data
    except Exception as e:
        logging.error(f"Error in get_stock_data for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/")
def read_root():
    return {"message": "Welcome to Stock Fight!"}


@app.get("/stock/{symbol}")
async def fetch_stock(symbol: str):
    try:
        cached_data = await redis.get(symbol)
        if cached_data:
            logging.info(f"Cache hit for {symbol}")
            return json.loads(cached_data)

        stock_data = await get_stock_data(symbol)
        await redis.set(
            symbol, json.dumps(stock_data), ex=settings.redis_ttl
        )  # Cache for 1 hour
        return stock_data
    except Exception as e:
        logging.error(f"Error in fetch_stock for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/stock/{symbol}/historical")
async def fetch_historical_data(
    symbol: str, range: str = Query("month", enum=["month", "week", "day"])
):
    try:
        cache_key = f"{symbol}_historical_{range}"
        cached_data = await redis.get(cache_key)
        if cached_data:
            logging.info(f"Cache hit for {cache_key}")
            return json.loads(cached_data)

        if range == "month":
            function = "TIME_SERIES_DAILY"
            interval = "daily"
            outputsize = "compact"
        elif range == "week":
            function = "TIME_SERIES_INTRADAY"
            interval = "60min"
            outputsize = "full"
        elif range == "day":
            function = "TIME_SERIES_INTRADAY"
            interval = "5min"
            outputsize = "full"
        else:
            raise HTTPException(status_code=400, detail="Invalid range")

        url = f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&apikey={settings.alpha_vantage_api_key}&outputsize={outputsize}"
        if range != "month":
            url += f"&interval={interval}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                logging.error(
                    f"Error fetching historical data from Alpha Vantage for {symbol}: {response.text}"
                )
                raise HTTPException(
                    status_code=400,
                    detail="Error fetching historical data from Alpha Vantage",
                )

            historical_data = response.json()

        await redis.set(
            cache_key, json.dumps(historical_data), ex=settings.redis_ttl
        )  # Cache for 1 hour
        logging.info(f"Fetched historical data for {symbol}: {historical_data}")
        return historical_data
    except Exception as e:
        logging.error(f"Error in fetch_historical_data for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


def get_pros_cons(symbol, exchange, country="USA"):
    exchange_map = {
        "XNYS": "NYE",
        "XNAS": "NSD",
        "XASE": "ASE",
        "ARCX": "ARCA",
        # Add other mappings if needed
    }
    mapped_exchange_code = exchange_map.get(exchange, "NYE")

    url = f"https://www.stocktargetadvisor.com/stock/{country}/{mapped_exchange_code}/{symbol}"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to retrieve data for {symbol}")
        return [], []

    soup = BeautifulSoup(response.text, "html.parser")

    pros_section = soup.find_all("div", class_="mb-3 like-dislike-box is-like")
    cons_section = soup.find_all("div", class_="mb-3 like-dislike-box is-dislike")

    pros = []
    for div in pros_section:
        title = div.find("h3").text.strip()
        content = div.find("p").text.strip() if (div.find("p")) else ""
        pros.append({"title": title, "content": content})

    cons = []
    for div in cons_section:
        title = div.find("h3").text.strip()
        content = div.find("p").text.strip() if (div.find("p")) else ""
        cons.append({"title": title, "content": content})

    return pros, cons


@app.get("/stock/{symbol}/pros_cons")
async def fetch_pros_cons(symbol: str):
    try:
        # Fetch data from Finnhub
        profile_data = await get_company_profile(symbol)
        exchange = profile_data.get("exchange")
        country = profile_data.get(
            "country", "USA"
        )  # Assuming USA if country is not available

        if not exchange:
            raise HTTPException(status_code=400, detail="Exchange code not found")

        # Fetch and parse pros and cons
        pros, cons = get_pros_cons(symbol, exchange, country)
        logging.info(
            f"Fetched pros and cons for {symbol}: Pros - {pros}, Cons - {cons}"
        )

        result = {"pros": pros, "cons": cons}
        cache_key = f"{symbol}_pros_cons"
        await redis.set(
            cache_key, json.dumps(result), ex=settings.redis_ttl
        )  # Cache for 1 hour

        return result
    except Exception as e:
        logging.error(f"Error in fetch_pros_cons for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
