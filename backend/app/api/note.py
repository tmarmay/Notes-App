from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.schemas.note import NoteCreate, NoteRead
from app.services.note import *
from app.db.database import get_session

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("/", response_model=NoteRead)
def create_note_endpoint(
    payload: NoteCreate,
    session: Session = Depends(get_session),
):
    note = create_note_service(
        session,
        title=payload.title,
        description=payload.description
    )
    return note

@router.get("/", response_model=list[NoteRead])
def get_notes_endpoint(
    session: Session = Depends(get_session),
):
    return get_notes_service(session)

@router.patch("/{note_id}", response_model=NoteRead)
def toggle_archive_endpoint(
    note_id: int,
    session: Session = Depends(get_session),
):
    return toggle_archive_service(session, note_id=note_id)

@router.delete("/{note_id}")
def delete_note_endpoint(
    note_id: int,
    session: Session = Depends(get_session),
):
    deleted = delete_note_service(session, note_id=note_id)
    return {"success": deleted, "note_id": note_id}
