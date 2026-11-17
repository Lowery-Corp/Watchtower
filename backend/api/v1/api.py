from fastapi import APIRouter

from api.v1.endpoints import (
    auth,
    health,
    projects
)

api_router = APIRouter()
# user endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# data endpoints
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
