from pydantic import BaseModel

class CreateProjectRequest(BaseModel):
    name: str
    description: str | None = None

class UpdateProjectRequest(BaseModel):
    name: str | None = None
    description: str | None = None