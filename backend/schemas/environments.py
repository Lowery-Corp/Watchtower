from pydantic import BaseModel

class CreateEnvironmentRequest(BaseModel):
    project_id: str | None = None
    environment_name: str
    environment_description: str | None = None

class UpdateEnvironmentRequest(BaseModel):
    environment_name: str | None = None
    environment_description: str | None = None