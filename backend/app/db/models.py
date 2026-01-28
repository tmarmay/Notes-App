from datetime import datetime
from typing import Optional, List

from sqlmodel import Field, SQLModel, Relationship


class NoteCategoryLink(SQLModel, table=True):
    note_id: Optional[int] = Field(
        default=None, foreign_key="note.id", primary_key=True
    )
    category_id: Optional[int] = Field(
        default=None, foreign_key="category.id", primary_key=True
    )


class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    archived: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    categories: List["Category"] = Relationship(
        back_populates="notes",
        link_model=NoteCategoryLink
    )

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    notes: List[Note] = Relationship(
        back_populates="categories",
        link_model=NoteCategoryLink
    )