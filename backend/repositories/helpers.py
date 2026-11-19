from uuid import UUID, uuid4

used_ids: set[UUID] = set()

def gen_id() -> UUID:
    new_id = uuid4()
    while new_id in used_ids:
        new_id = uuid4()

    used_ids.add(new_id)
    return new_id
