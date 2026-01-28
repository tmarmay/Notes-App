from sqlmodel import Session
from fastapi import HTTPException

from app.repositories.note import *
from app.db.models import Note

def create_note_service(session: Session, *, title: str, description: str) -> Note:
    return create_note(session, title=title, description=description)

def get_notes_service(session: Session) -> list[Note]:
    return get_notes(session)

def toggle_archive_service(session: Session, *, note_id: int) -> Note:
    return toggle_archive(session, note_id=note_id)

def delete_note_service(session: Session, *, note_id: int) -> list[Note]:
    deleted = delete_note(session, note_id=note_id)
    if not deleted:
        raise HTTPException(
            status_code=404, detail=f"Error deleting note {note_id}"
        )
    return deleted