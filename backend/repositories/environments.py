from typing import Any
from uuid import UUID

from repositories.helpers import gen_id
from db.database import database
from schemas.environments import CreateEnvironmentRequest, UpdateEnvironmentRequest

from repositories.projects import get_projects


async def get_environments_by_project(
    user_id: UUID,
    project_id: UUID,
    environment_id: UUID | None = None,
) -> dict[Any, Any]:
    if user_id not in database:
        return {"error": "no environments found for user"}

    user_project = await get_projects(user_id, project_id)

    user_environments: dict[UUID, Any] = user_project.get("environments", {})

    if environment_id:
        environment = user_environments[environment_id]
        return environment

    return user_environments


async def create_environment(
    new_environment_body: CreateEnvironmentRequest,
    project_id: UUID,
    user_id: UUID,
) -> dict[str, str | Any]:
    new_environment: dict[str, Any] = {
        "id": gen_id(),
        "name": new_environment_body.name,
        "description": new_environment_body.description or "No description provided",
    }

    if user_id not in database:
        database[user_id] = {"projects": {}}

    user_project = await get_projects(user_id, project_id)

    if not user_project:
        return {"error": "Project not found"}

    if "environments" not in user_project:
        user_project["environments"] = {}

    user_project["environments"][new_environment["id"]] = new_environment
    return await get_environments_by_project(user_id, project_id, new_environment["id"])


async def update_environment(
    updated_environment_body: UpdateEnvironmentRequest,
    project_id: UUID,
    environment_id: UUID,
    user_id: UUID,
) -> dict[str, str | Any]:
    user_project = await get_projects(user_id, project_id)

    if not user_project:
        return {"error": "Project not found"}

    project_environments: dict[UUID, Any] = user_project.get("environments", {})

    current_environment: dict[str, Any] = project_environments.get(environment_id, {})

    if not current_environment:
        return {"error": "Environment not found"}

    updated_environment: dict[str, Any] = {
        "id": current_environment.get("id"),
        "name": updated_environment_body.name or current_environment.get("name", "No name provided"),
        "description": updated_environment_body.description or current_environment.get("description", "No description provided"),
    }

    database[user_id]["projects"][project_id]["environments"][environment_id] = updated_environment
    return await get_environments_by_project(user_id, project_id, environment_id)


async def delete_environment(
    project_id: UUID,
    environment_id: UUID,
    user_id: UUID,
) -> dict[str, str | Any]:
    user_project = await get_projects(user_id, project_id)

    if not user_project:
        return {"error": "Project not found"}

    project_environments: dict[UUID, Any] = user_project.get("environments", {})

    current_environment: dict[str, Any] = project_environments.get(environment_id, {})

    if not current_environment:
        return {"error": "Environment not found"}

    del database[user_id]["projects"][project_id]["environments"][environment_id]
    return {"message": "Environment deleted successfully"}
