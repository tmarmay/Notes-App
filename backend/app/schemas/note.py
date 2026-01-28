from pydantic import BaseModel

class NoteCreate(BaseModel):
    title: str
    description: str


class NoteRead(BaseModel):
    id: int
    title: str
    description: str
    archived: bool
