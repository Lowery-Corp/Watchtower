from fastapi import APIRouter

from api.v1.endpoints import (
    auth,
    health,
    projects,
    environments,
    monitors,
)

api_router = APIRouter()
# user endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# data endpoints
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(environments.router, prefix="/projects", tags=["Environments"])
api_router.include_router(monitors.router, prefix="/projects", tags=["Monitors"])
