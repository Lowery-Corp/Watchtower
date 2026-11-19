from pydantic import BaseModel

class CreateMonitorRequest(BaseModel):
    tag: str
    url: str
    name: str
    description: str | None = None

class UpdateMonitorRequest(BaseModel):
    tag: str | None = None
    url: str | None = None
    name: str | None = None
    description: str | None = None

class MonitorStatusHistoryEntry(BaseModel):
    status: str
    timestamp: float

class GetMonitorResponse(BaseModel):
    id: str
    tag: str
    url: str
    name: str
    description: str | None = None
    status: str | None = None
    status_history: list[MonitorStatusHistoryEntry] | None = None
