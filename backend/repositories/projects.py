from typing import Any
from uuid import UUID, uuid4

from schemas.user import AuthorizedUser
from schemas.projects import CreateProjectRequest, UpdateProjectRequest

projects_cache: dict[UUID, Any] = {}

# ==================================helpers==================================
async def gen_project_id(current_user: AuthorizedUser) -> UUID:

    new_project_id: UUID = uuid4()
    try:
        project_id_in_cache: bool = True if projects_cache[current_user.id]["projects"][new_project_id] else False
    except KeyError:
        project_id_in_cache: bool = False

    if project_id_in_cache:
        new_project_id = await gen_project_id(current_user)

    return new_project_id

# ==================================main==================================
async def get_projects(
    current_user: AuthorizedUser,
    project_id: UUID|None = None,
) -> dict[str, Any]:

    if project_id:
        user_projects: dict[str, Any] = projects_cache.get(current_user.id, {"projects": {}})
        project: dict[str, Any] = user_projects["projects"].get(project_id, {})
        return project
    elif not project_id:
        user_projects: dict[str, Any] = projects_cache.get(current_user.id, {"projects": {}})
        return user_projects


async def create_project(
    new_project_body: CreateProjectRequest,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    new_project: dict[str, Any] = {
        "project": {
            "id": await gen_project_id(current_user),
            "name": new_project_body.project_name,
            "description": new_project_body.project_description or "No description provided",
        },
    }

    if current_user.id not in projects_cache:
        projects_cache[current_user.id] = {"projects": {}}

    projects_cache[current_user.id]["projects"][new_project["project"]["id"]] = new_project["project"]
    return await get_projects(current_user, new_project["project"]["id"])


async def update_project(
    updated_project_body: UpdateProjectRequest,
    project_id: UUID,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    current_project: dict[str, Any] = await get_projects(current_user, project_id)

    if not current_project:
        return {"error": "Project not found"}

    updated_project: dict[str, Any] = {
        "project": {
            "id": current_project.get("id"),
            "name": updated_project_body.project_name or current_project.get("name", "No name provided"),
            "description": updated_project_body.project_description or current_project.get("description", "No description provided"),
        },
    }

    projects_cache[current_user.id]["projects"][project_id] = updated_project["project"]
    return updated_project


async def delete_project(
    project_id: UUID,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    current_project: dict[str, Any] = await get_projects(current_user, project_id)

    if not current_project:
        return {"error": "Project not found"}

    del projects_cache[current_user.id]["projects"][project_id]
    return {"ok": True }
