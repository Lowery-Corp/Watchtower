from fastapi import APIRouter, Depends
from typing import Any
from uuid import UUID

from auth.dependencies import get_current_user
from schemas.user import AuthorizedUser
from schemas.environments import CreateEnvironmentRequest, UpdateEnvironmentRequest

from repositories.environments import (
    get_environments_by_project,
    # create_environment,
    # update_environment,
    # delete_environment,
)

router = APIRouter(tags=["project environments"])

@router.get("/{project_id}/environments", summary="Get a specific environments for a specific project for the current user")
@router.get("/{project_id}/environments/{environment_id}", summary="Get a specific environment for a specific project for the current user")
async def fetch_environments_by_project(
    project_id: UUID,
    environment_id: UUID | None = None,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:

    user_environments: dict[str, Any] = await get_environments_by_project(current_user, project_id, environment_id)

    return user_environments

@router.post("/{project_id}/environments", summary="Create a new environment for a specific project for the current user")
async def create_environment(
    project_id: UUID,
    new_environment_body: CreateEnvironmentRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:
    new_environment: dict[str, Any] = await create_environment(new_environment_body, project_id, current_user)

    return new_environment
