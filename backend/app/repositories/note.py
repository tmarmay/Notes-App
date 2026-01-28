from datetime import datetime
from sqlmodel import Session, select

from app.db.models import Note

def get_notes(session: Session) -> list[Note]:
    return session.exec(select(Note)).all()

def create_note(session: Session, *, title: str, description: str) -> Note:
    note = Note(
        title = title,
        description = description,
        archived =False,
        created_at = datetime.now(),
        updated_at = datetime.now(),
    )

    session.add(note)
    session.commit()
    session.refresh(note)
    return note

def edit_note(session: Session, *, title: str, description: str, note_id: int) -> Note:
    note = session.get(Note, note_id)
    note.title = title
    note.description = description
    note.updated_at = datetime.now()
    
    session.commit()
    session.refresh(note)
    return note

def delete_note(session: Session, *, note_id: int) -> bool:
    note = session.get(Note, note_id)
    if not note:
        return False

    session.delete(note)
    session.commit()
    return True

def toggle_archive(session: Session, *, note_id: int) -> Note:
    note = session.get(Note, note_id)
    note.archived = not note.archived 
    note.updated_at = datetime.now()
    
    session.commit()
    session.refresh(note)
    return note
