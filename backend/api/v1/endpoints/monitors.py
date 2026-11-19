import json
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder
from redis.asyncio import Redis

from auth.dependencies import get_current_user
from schemas.user import AuthorizedUser
from schemas.monitors import CreateMonitorRequest, UpdateMonitorRequest
from repositories.monitors import (
    get_monitors,
    create_monitor,
    update_monitor,
    delete_monitor,
)

router = APIRouter()


def monitor_cache_key(
    user_id: UUID,
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID | None = None,
) -> str:
    return (
        f"monitors:"
        f"{str(user_id).replace("-", "")}:"
        f"{str(project_id).replace("-", "")}:"
        f"{str(environment_id).replace("-", "")}:"
        f"{str(monitor_id).replace("-", "") or 'all'}"
    )


@router.get("/{project_id}/environments/{environment_id}/monitors", summary="Get all monitors for a specific environment in a specific project for the current user")
@router.get("/{project_id}/environments/{environment_id}/monitors/{monitor_id}", summary="Get a specific monitor for a specific environment in a specific project for the current user")
async def fetch_environments_by_project(
    request: Request,
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID | None = None,
    current_user: AuthorizedUser = Depends(get_current_user),
    cache: bool = True,
) -> dict[Any, Any]:
    redis: Redis = request.app.state.redis

    cache_key = monitor_cache_key(
        user_id=current_user.id,
        project_id=project_id,
        environment_id=environment_id,
        monitor_id=monitor_id,
    )

    cached_monitors = await redis.get(cache_key)

    if cached_monitors is not None and cache:
        return json.loads(cached_monitors)

    environment_monitors: dict[str, Any] = await get_monitors(
        user_id=current_user.id,
        project_id=project_id,
        environment_id=environment_id,
        monitor_id=monitor_id,
    )

    encoded_monitors = jsonable_encoder(environment_monitors)

    await redis.set(
        name=cache_key,
        value=json.dumps(encoded_monitors, default=str),
        ex=60,
    )

    return environment_monitors


@router.post("/{project_id}/environments/{environment_id}/monitors", summary="Create a new monitor for a specific environment in a specific project for the current user")
async def new_monitor(
    request: Request,
    project_id: UUID,
    environment_id: UUID,
    new_monitor_body: CreateMonitorRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:
    new_monitor: dict[str, Any] = await create_monitor(
        new_monitor_body=new_monitor_body,
        project_id=project_id,
        environment_id=environment_id,
        user_id=current_user.id,
    )

    redis: Redis = request.app.state.redis

    await redis.delete(
        monitor_cache_key(
            user_id=current_user.id,
            project_id=project_id,
            environment_id=environment_id,
        )
    )

    return new_monitor


@router.put("/{project_id}/environments/{environment_id}/monitors/{monitor_id}", summary="Update an existing monitor for a specific environment in a specific project for the current user")
async def edit_monitor(
    request: Request,
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID,
    updated_monitor_body: UpdateMonitorRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:
    updated_monitor: dict[str, Any] = await update_monitor(
        updated_monitor_body,
        project_id=project_id,
        environment_id=environment_id,
        monitor_id=monitor_id,
        user_id=current_user.id,
    )

    redis: Redis = request.app.state.redis

    await redis.delete(
        monitor_cache_key(
            user_id=current_user.id,
            project_id=project_id,
            environment_id=environment_id,
        ),
        monitor_cache_key(
            user_id=current_user.id,
            project_id=project_id,
            environment_id=environment_id,
            monitor_id=monitor_id,
        ),
    )

    return updated_monitor


@router.delete("/{project_id}/environments/{environment_id}/monitors/{monitor_id}",summary="Delete an existing monitor for a specific environment in a specific project for the current user")
async def remove_monitor(
    request: Request,
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:
    deleted_monitor: dict[str, str | Any] = await delete_monitor(
        project_id=project_id,
        environment_id=environment_id,
        monitor_id=monitor_id,
        user_id=current_user.id,
    )

    redis: Redis = request.app.state.redis

    await redis.delete(
        monitor_cache_key(
            user_id=current_user.id,
            project_id=project_id,
            environment_id=environment_id,
        ),
        monitor_cache_key(
            user_id=current_user.id,
            project_id=project_id,
            environment_id=environment_id,
            monitor_id=monitor_id,
        ),
    )

    return deleted_monitor