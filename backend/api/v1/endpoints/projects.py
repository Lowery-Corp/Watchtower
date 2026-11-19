from typing import Any
from uuid import UUID
import json

from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder
from redis.asyncio import Redis

from auth.dependencies import get_current_user
from schemas.user import AuthorizedUser
from schemas.projects import CreateProjectRequest, UpdateProjectRequest

from repositories.projects import (
    get_projects,
    create_project,
    update_project,
    delete_project,
)

router = APIRouter()

def monitor_cache_key(
    user_id: UUID,
    project_id: UUID | None = None,
) -> str:
    return (
        f"projects:"
        f"{str(user_id).replace("-", "")}:"
        f"{str(project_id).replace("-", "") or 'all'}"
    )


@router.get("", summary="Get all projects for the current user")
@router.get("/{project_id}", summary="Get a specific project for the current user")
async def fetch_projects(
    request: Request,
    project_id: UUID | None = None,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[Any, Any]:
    redis: Redis = request.app.state.redis

    cache_key = monitor_cache_key(
        user_id=current_user.id,
        project_id=project_id
    )

    cached_projects = await redis.get(cache_key)

    if cached_projects is not None:
        return json.loads(cached_projects)

    user_projects: dict[str, Any] = await get_projects(
        user_id=current_user.id,
        project_id=project_id
    )

    encoded_projects = jsonable_encoder(user_projects)

    await redis.set(cache_key, json.dumps(encoded_projects), ex=10)

    return user_projects


@router.post("", summary="Create a new project for the current user")
async def new_project(
    request: Request,
    new_project_body: CreateProjectRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:
    new_project = await create_project(
        new_project_body,
        user_id=current_user.id,
    )

    redis: Redis = request.app.state.redis

    await redis.delete(
        monitor_cache_key(
            user_id=current_user.id
        )
    )

    return new_project


@router.put("/{project_id}", summary="Update an existing project for the current user")
async def edit_project(
    request: Request,
    project_id: UUID,
    updated_project_body: UpdateProjectRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:

    redis: Redis = request.app.state.redis

    updated_project: dict[str, Any] = await update_project(
        updated_project_body,
        user_id=current_user.id,
        project_id=project_id
    )

    await redis.delete(
        monitor_cache_key(
            user_id=current_user.id,
            project_id=project_id
        )
    )

    return updated_project


@router.delete("/{project_id}", summary="Delete an existing project for the current user")
async def trash_project(
    request: Request,
    project_id: UUID,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:

    redis: Redis = request.app.state.redis

    deleted = await delete_project(
        project_id=project_id,
        user_id=current_user.id
    )

    await redis.delete(
        monitor_cache_key(
            user_id=current_user.id,
            project_id=project_id
        )
    )

    return deleted
