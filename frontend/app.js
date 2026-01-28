// ==============================
// Config
// ==============================
const API_BASE_URL = "http://127.0.0.1:8000";

// ==============================
// Vars
// ==============================
let selectedNoteId = null;
const archiveButton = document.querySelector(".archive-btn");

// ==============================
// DOM references
// ==============================
const activeNotesList = document.querySelector(".notes-list");
const archivedNotesList = document.querySelector(".archived-list");

// ==============================
// Fetch notes
// ==============================
async function fetchNotes() {
    const response = await fetch(`${API_BASE_URL}/notes/`);
    if (!response.ok) {
        console.error("Error fetching notes");
        return [];
    }
    return await response.json();
}

// ==============================
// Select note
// ==============================
function selectNote(note, element) {
    selectedNoteId = note.id;

    document.querySelector("#title").value = note.title;
    document.querySelector("#description").value = note.description;

    document.querySelectorAll(".note-item.active")
        .forEach(item => item.classList.remove("active"));

    element.classList.add("active");

    updateArchiveButton(note.archived);
}

// ==============================
// Archive botton
// ==============================
function updateArchiveButton(isArchived) {
    archiveButton.textContent = isArchived ? "Unarchive" : "Archive";
}

// ==============================
// Toggle archive function
// ==============================
async function toggleArchive() {
    if (!selectedNoteId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/notes/${selectedNoteId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Error toggling archive status");
            return;
        }

        const updatedNote = await response.json();

        updateArchiveButton(updatedNote.archived);
        renderNotes();

    } catch (err) {
        console.error("Network error:", err);
    }
}
archiveButton.addEventListener("click", toggleArchive);

// ==============================
// Delete note
// ==============================
async function deleteNote() {
    if (!selectedNoteId) {
        alert("Select a note to delete");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/notes/${selectedNoteId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            console.error("Error deleting note");
            return;
        }

        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        selectedNoteId = null;
        archiveButton.disabled = true;

        renderNotes();

    } catch (err) {
        console.error("Network error:", err);
    }
}

const deleteButton = document.querySelector(".delete-btn");
deleteButton.addEventListener("click", deleteNote);

// ==============================
// Render helpers
// ==============================
function createNoteItem(note) {
    const li = document.createElement("li");
    li.classList.add("note-item");
    li.dataset.id = note.id; 

    if (note.archived) {
        li.classList.add("archived");
    }

    const title = document.createElement("h3");
    title.textContent = note.title;

    const description = document.createElement("p");
    description.textContent = note.description;

    li.appendChild(title);
    li.appendChild(description);

    li.addEventListener("click", () => {
        selectNote(note, li);
    });
    
    return li;
}

function clearLists() {
    activeNotesList.innerHTML = "";
    archivedNotesList.innerHTML = "";
}

// ==============================
// Main render
// ==============================
async function renderNotes() {
    const notes = await fetchNotes();
    clearLists();

    notes.forEach(note => {
        const noteItem = createNoteItem(note);

        if (note.archived) {
            archivedNotesList.appendChild(noteItem);
        } else {
            activeNotesList.appendChild(noteItem);
        }
    });
}

// ==============================
// Start New Note
// ==============================
function startNewNote() {
    const titleInput = document.querySelector("#title");
    const descriptionInput = document.querySelector("#description");

    titleInput.value = "";
    descriptionInput.value = "";

}
// ==============================
// Create Note
// ==============================
async function createNote() {
    const titleInput = document.querySelector("#title");
    const descriptionInput = document.querySelector("#description");

    const payload = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
    };

    if (!payload.title || !payload.description) {
        alert("Title and description are required");
        return;
    }

    const response = await fetch(`${API_BASE_URL}/notes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        console.error("Error creating note");
        return;
    }

    titleInput.value = "";
    descriptionInput.value = "";

    renderNotes();
}


// ==============================
// Init
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    renderNotes();
});
