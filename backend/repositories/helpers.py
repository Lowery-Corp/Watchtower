from typing import Any
from uuid import UUID, uuid4

from schemas.user import AuthorizedUser

async def gen_id(current_user: AuthorizedUser, object_name:str, object_cache: dict[Any, Any]) -> UUID:

    new_id: UUID = uuid4()
    try:
        environment_id_in_cache: bool = True if object_cache[current_user.id][object_name][new_id] else False
    except KeyError:
        environment_id_in_cache: bool = False

    if environment_id_in_cache:
        new_id = await gen_id(current_user, object_name, object_cache)

    return new_id