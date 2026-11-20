from httpx import AsyncClient, RequestError
from asyncio import sleep

from db.database import database
from repositories.monitors import update_monitor_uptime, delete_old_status_history


async def site_check() -> None:
    async with AsyncClient() as client:
        while True:
            for user_id, user_data in database.items():
                projects = user_data.get("projects", {})

                for project_id, project_data in projects.items():
                    environments = project_data.get("environments", {})

                    for environment_id, environment_data in environments.items():
                        monitors = environment_data.get("monitors", {})

                        for monitor_id, monitor_data in monitors.items():
                            url = monitor_data.get("url")

                            if not url:
                                continue

                            try:
                                response = await client.get(
                                    url,
                                    timeout=10.0,
                                )
                                status = response.is_success
                            except RequestError:
                                status = False

                            await update_monitor_uptime(
                                user_id,
                                project_id,
                                environment_id,
                                monitor_id,
                                status,
                            )
            await sleep(60)


async def cleanup_status_history() -> None:
    while True:
        for user_id, user_data in database.items():
            projects = user_data.get("projects", {})

            for project_id, project_data in projects.items():
                environments = project_data.get("environments", {})

                for environment_id, environment_data in environments.items():
                    monitors = environment_data.get("monitors", {})

                    for monitor_id in monitors.keys():
                        await delete_old_status_history(
                            user_id,
                            project_id,
                            environment_id,
                            monitor_id,
                        )
        await sleep(3600)  # Run every hour
