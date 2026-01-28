from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.db.database import create_db_and_tables
from app.api.note import router as note_router

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# API
app.include_router(note_router)


# Frontend
app.mount(
    "/static",
    StaticFiles(directory="../frontend"),
    name="frontend",
)

@app.get("/")
async def root():
    return FileResponse("../frontend/index.html")