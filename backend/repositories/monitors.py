from typing import Any
from uuid import UUID

from repositories.helpers import gen_id
from db.database import database
from schemas.user import AuthorizedUser
from schemas.monitors import CreateMonitorRequest, UpdateMonitorRequest

from repositories.environments import get_environments_by_project

async def get_monitors(
    current_user: AuthorizedUser,
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID | None = None,
) -> dict[Any, Any]:
    if current_user.id not in database:
        return {"error": "no monitors found for user"}

    current_environment: dict[Any, Any] = await get_environments_by_project(current_user, project_id, environment_id)

    if not current_environment:
        return {"error": "Environment not found"}

    current_environment_monitors: dict[UUID, Any] = current_environment.get("monitors", {})
    if monitor_id:
        monitor = current_environment_monitors.get(monitor_id)
        if not monitor:
            return {"error": "Monitor not found"}
        return monitor
    return current_environment_monitors


async def create_monitor(
    new_monitor_body: CreateMonitorRequest,
    project_id: UUID,
    environment_id: UUID,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    new_monitor: dict[str, Any] = {
        "id": gen_id(),
        "tag": new_monitor_body.tag,
        "url": new_monitor_body.url,
        "name": new_monitor_body.name,
        "description": new_monitor_body.description or "No description provided",
    }

    if current_user.id not in database:
        database[current_user.id] = {"projects": {}}

    current_environment: dict[Any, Any] = await get_environments_by_project(current_user, project_id, environment_id)

    if not current_environment:
        return {"error": "Environment not found"}

    if "monitors" not in current_environment:
        current_environment["monitors"] = {}

    database[current_user.id]["projects"][project_id]["environments"][environment_id]["monitors"][new_monitor["id"]] = new_monitor
    return await get_monitors(current_user, project_id, environment_id, new_monitor["id"])


async def update_monitor(
    updated_monitor_body: UpdateMonitorRequest,
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    current_monitor: dict[str, Any] = await get_monitors(current_user, project_id, environment_id, monitor_id)

    if not current_monitor:
        return {"error": "Monitor not found"}

    current_monitor["tag"] = updated_monitor_body.tag or current_monitor.get("tag", "No tag provided")
    current_monitor["url"] = updated_monitor_body.url or current_monitor.get("url", "No URL provided")
    current_monitor["name"] = updated_monitor_body.name or current_monitor.get("name", "No name provided")
    current_monitor["description"] = updated_monitor_body.description or current_monitor.get("description", "No description provided")

    database[current_user.id]["projects"][project_id]["environments"][environment_id]["monitors"][monitor_id] = current_monitor
    return current_monitor


async def delete_monitor(
    project_id: UUID,
    environment_id: UUID,
    monitor_id: UUID,
    current_user: AuthorizedUser,
) -> dict[str, str | Any]:
    current_monitor: dict[str, Any] = await get_monitors(current_user, project_id, environment_id, monitor_id)

    if not current_monitor:
        return {"error": "Monitor not found"}

    del database[current_user.id]["projects"][project_id]["environments"][environment_id]["monitors"][monitor_id]
    return {"message": "Monitor deleted successfully"}