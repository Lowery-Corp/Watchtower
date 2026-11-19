from pydantic import BaseModel

class CreateEnvironmentRequest(BaseModel):
    name: str
    description: str | None = None

class UpdateEnvironmentRequest(BaseModel):
    name: str | None = None
    description: str | None = None