from typing import Any
from uuid import UUID

from repositories.helpers import gen_id
from db.database import database
from schemas.user import AuthorizedUser
from schemas.environments import CreateEnvironmentRequest, UpdateEnvironmentRequest

from repositories.projects import get_projects


async def get_environments_by_project(
    current_user: AuthorizedUser,
    project_id: UUID,
    environment_id: UUID|None = None,
) -> dict[str, Any]:
    if current_user.id not in database:
        return {"error": "no environments found for user"}

    user_project = await get_projects(current_user, project_id)

    user_environments: dict[str, Any] = user_project.get("environments", {})

    if environment_id:
        environment_data = user_environments.get(str(environment_id))
        environment: dict[str, Any] = environment_data if environment_data is not None else {}
        return environment

    return user_environments

# async def create_environment(
#     new_environment_body: CreateEnvironmentRequest,
#     project_id: UUID,
#     current_user: AuthorizedUser,
# ) -> dict[str, str | Any]:
#     new_environment: dict[str, Any] = {
#         "id": await gen_id(current_user, "environment", database),
#         "name": new_environment_body.environment_name,
#         "description": new_environment_body.environment_description or "No description provided",
#     }

#     if current_user.id not in database:
#         database[current_user.id] = {"projects": {}}

#     user_project = await get_projects(current_user, project_id)

#     if not user_project:
#         return {"error": "Project not found"}

#     if "environments" not in user_project:
#         user_project["environments"] = {}

#     user_project["environments"][new_environment["environment"]["id"]] = new_environment["environment"]
#     return await get_environments_by_project(current_user, project_id, new_environment["environment"]["id"])
