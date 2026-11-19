from fastapi import APIRouter, Depends
from typing import Any
from uuid import UUID

from auth.dependencies import get_current_user
from schemas.user import AuthorizedUser
from schemas.environments import CreateEnvironmentRequest, UpdateEnvironmentRequest

from repositories.environments import (
    get_environments_by_project,
    create_environment,
    update_environment,
    delete_environment,
)

router = APIRouter()

@router.get("/{project_id}/environments", summary="Get a specific environments for a specific project for the current user")
@router.get("/{project_id}/environments/{environment_id}", summary="Get a specific environment for a specific project for the current user")
async def fetch_environments_by_project(
    project_id: UUID,
    environment_id: UUID | None = None,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[Any, Any]:

    user_environments: dict[str, Any] = await get_environments_by_project(
        user_id=current_user.id,
        project_id=project_id,
        environment_id=environment_id
    )

    return user_environments


@router.post("/{project_id}/environments", summary="Create a new environment for a specific project for the current user")
async def new_environment(
    project_id: UUID,
    new_environment_body: CreateEnvironmentRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:
    new_environment: dict[str, Any] = await create_environment(
        new_environment_body=new_environment_body,
        project_id=project_id,
        user_id=current_user.id
    )

    return new_environment


@router.put("/{project_id}/environments/{environment_id}", summary="Update an existing environment for a specific project for the current user")
async def edit_environment(
    project_id: UUID,
    environment_id: UUID,
    updated_environment_body: UpdateEnvironmentRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:
    updated_environment: dict[str, Any] = await update_environment(
        updated_environment_body=updated_environment_body,
        project_id=project_id,
        environment_id=environment_id,
        user_id=current_user.id
    )

    return updated_environment


@router.delete("/{project_id}/environments/{environment_id}", summary="Delete an existing environment for a specific project for the current user")
async def delete_environment_endpoint(
    project_id: UUID,
    environment_id: UUID,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:
    deleted_environment: dict[str, str | Any] = await delete_environment(
        project_id=project_id,
        environment_id=environment_id,
        user_id=current_user.id)

    return deleted_environment
