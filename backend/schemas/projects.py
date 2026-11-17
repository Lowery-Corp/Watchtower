from pydantic import BaseModel

class CreateProjectRequest(BaseModel):
    project_name: str
    project_description: str | None = None

class UpdateProjectRequest(BaseModel):
    project_name: str | None = None
    project_description: str | None = None