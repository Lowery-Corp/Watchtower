import asyncio
from contextlib import asynccontextmanager, suppress
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v1.api import api_router
from cache.redis import redis_manager
from core.config import settings
from httpxC.http_client import http_client
from middleware.request_id import RequestIDMiddleware
from tasks.tasks import site_check, cleanup_status_history


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    await redis_manager.connect()
    await redis_manager.flushdb()

    redis = redis_manager.get_client()
    app.state.redis = redis

    site_check_task = asyncio.create_task(
        site_check(),
        name="site-check",
    )
    cleanup_status_history_task = asyncio.create_task(
        cleanup_status_history(),
        name="cleanup-status-history",
    )

    try:
        yield
    finally:
        site_check_task.cancel()
        cleanup_status_history_task.cancel()

        with suppress(asyncio.CancelledError):
            await site_check_task

        await redis_manager.disconnect()
        await http_client.aclose()


app = FastAPI(
    title="Watchtower API",
    lifespan=lifespan,
)


app.add_middleware(RequestIDMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Accept",
        "Authorization",
        "Content-Type",
        "Origin",
    ],
)


app.include_router(api_router, prefix="/api/v1")