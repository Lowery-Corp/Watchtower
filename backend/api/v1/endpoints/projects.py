from fastapi import APIRouter, Depends
from typing import Any
from uuid import UUID

from auth.dependencies import get_current_user
from schemas.user import AuthorizedUser
from schemas.projects import CreateProjectRequest, UpdateProjectRequest

from repositories.projects import (
    get_projects,
    create_project,
    update_project,
    delete_project,
)


router = APIRouter(tags=["projects"])

@router.get("", summary="Get all projects for the current user")
@router.get("/{project_id}", summary="Get a specific project for the current user")
async def fetch_projects(
    project_id: UUID | None = None,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, Any]:

    user_projects: dict[str, Any] = await get_projects(current_user, project_id)

    return user_projects


@router.post("", summary="Create a new project for the current user")
async def new_project(
    new_project_body: CreateProjectRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:

    new_project: dict[str, Any] = {
        "user_id": current_user.id,
        "project": {
            "name": new_project_body.project_name,
            "description": new_project_body.project_description or "No description provided",
        },
    }

    new_project = await create_project(
        new_project_body,
        current_user=current_user,
    )

    return new_project


@router.put("/{project_id}", summary="Update an existing project for the current user")
async def edit_project(
    project_id: UUID,
    updated_project_body: UpdateProjectRequest,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:

    updated_project: dict[str, Any] = await update_project(
        updated_project_body,
        current_user=current_user,
        project_id=project_id
    )

    return updated_project


@router.delete("/{project_id}", summary="Delete an existing project for the current user")
async def trash_project(
    project_id: UUID,
    current_user: AuthorizedUser = Depends(get_current_user),
) -> dict[str, str | Any]:

    deleted = await delete_project(project_id=project_id, current_user=current_user)

    return deleted