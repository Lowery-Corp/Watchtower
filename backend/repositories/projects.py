from typing import Any
from uuid import UUID

from repositories.helpers import gen_id
from db.database import database
from schemas.user import AuthorizedUser
from schemas.projects import CreateProjectRequest, UpdateProjectRequest



async def get_projects(
    current_user: AuthorizedUser,
    project_id: UUID|None = None,
) -> dict[str, Any]:

    if project_id:
        user_projects: dict[str, Any] = database.get(current_user.id, {"projects": {}})
        project: dict[str, Any] = user_projects["projects"].get(project_id, {})
        return project
    elif not project_id:
        user_projects: dict[str, Any] = database.get(current_user.id, {"projects": {}})
        return user_projects


async def create_project(
    new_project_body: CreateProjectRequest,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    new_project: dict[str, Any] = {
        "id": gen_id(),
        "name": new_project_body.project_name,
        "description": new_project_body.project_description or "No description provided",
    }

    if current_user.id not in database:
        database[current_user.id] = {"projects": {}}

    database[current_user.id]["projects"][new_project["id"]] = new_project
    return await get_projects(current_user, new_project["id"])


async def update_project(
    updated_project_body: UpdateProjectRequest,
    project_id: UUID,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    current_project: dict[str, Any] = await get_projects(current_user, project_id)

    if not current_project:
        return {"error": "Project not found"}

    current_project["name"] = updated_project_body.project_name or current_project.get("name", "No name provided")
    current_project["description"] = updated_project_body.project_description or current_project.get("description", "No description provided")

    database[current_user.id][project_id] = current_project
    return current_project


async def delete_project(
    project_id: UUID,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    current_project: dict[str, Any] = await get_projects(current_user, project_id)

    if not current_project:
        return {"error": "Project not found"}

    del database[current_user.id]["projects"][project_id]
    return {"ok": True }
