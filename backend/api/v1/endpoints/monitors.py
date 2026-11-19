from fastapi import APIRouter, Depends
from typing import Any
from uuid import UUID

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

@router.get("/{project_id}/environments/{environment_id}/monitors", summary="Get all monitors for a specific environment in a specific project for the current user")
@router.get("/{project_id}/environments/{environment_id}/monitors/{monitor_id}", summary="Get a specific monitor for a specific environment in a specific project for the current user")
async def fetch_environments_by_project(
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID | None = None,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[Any, Any]:

    environment_monitors: dict[str, Any] = await get_monitors(current_user, project_id, environment_id, monitor_id)

    return environment_monitors

@router.post("/{project_id}/environments/{environment_id}/monitors", summary="Create a new monitor for a specific environment in a specific project for the current user")
async def new_monitor(
    project_id: UUID,
    environment_id: UUID,
    new_monitor_body: CreateMonitorRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:
    new_monitor: dict[str, Any] = await create_monitor(new_monitor_body, project_id, environment_id, current_user)

    return new_monitor


@router.put("/{project_id}/environments/{environment_id}/monitors/{monitor_id}", summary="Update an existing monitor for a specific environment in a specific project for the current user")
async def edit_monitor(
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID,
    updated_monitor_body: UpdateMonitorRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:
    updated_monitor: dict[str, Any] = await update_monitor(updated_monitor_body, project_id, environment_id, monitor_id, current_user)

    return updated_monitor


@router.delete("/{project_id}/environments/{environment_id}/monitors/{monitor_id}", summary="Delete an existing monitor for a specific environment in a specific project for the current user")
async def remove_monitor(
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:
    deleted_monitor: dict[str, str | Any] = await delete_monitor(project_id, environment_id, monitor_id, current_user)

    return deleted_monitor