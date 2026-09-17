/*
 * AI Disclosure:
 * ChatGPT was used to help explain JavaScript concepts, and design the OOP structure for this assignment.
 * I reviewed, understood, and tested the submitted code.
 */
import { USER_FACING_MESSAGES } from "../lang/messages/en/user.js";

const STORAGE_KEY = "notes";
const SAVE_INTERVAL_MS = 2000;

class Note {
    constructor(content = USER_FACING_MESSAGES.EMPTY_NOTE, onRemove) {
        this.container = document.createElement("div");

        this.textarea = document.createElement("textarea");
        this.textarea.value = content;

        this.removeButton = document.createElement("button");
        this.removeButton.textContent = USER_FACING_MESSAGES.REMOVE_BUTTON;

        this.container.appendChild(this.textarea);
        this.container.appendChild(this.removeButton);

        this.removeButton.addEventListener("click", () => {
            onRemove(this);
        });
    }

    render(parentContainer) {
        parentContainer.appendChild(this.container);
    }

    getData() {
        return { content: this.textarea.value };
    }
}

class WriterApp {
    constructor() {
        this.notes = [];
        this.notesContainer = document.getElementById("notes-container");

        this.addButton = document.getElementById("add-button");
        this.addButton.textContent = USER_FACING_MESSAGES.ADD_BUTTON;
        this.addButton.addEventListener("click", () => this.addNote());

        this.saveStatus = document.getElementById("save-status");

        this.backButton = document.getElementById("back-button");
        this.backButton.textContent = USER_FACING_MESSAGES.BACK_BUTTON;

        this.backButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });

        document.title = USER_FACING_MESSAGES.PAGE_TITLE;

        this.loadNotes();
        this.saveNotes();

        setInterval(() => {
            this.saveNotes();
        }, SAVE_INTERVAL_MS);
    }

    loadNotes() {
        const notesJson = localStorage.getItem(STORAGE_KEY);

        if (notesJson) {
            const notesData = JSON.parse(notesJson);
            notesData.forEach((noteData) => {
                const note = new Note(
                    noteData.content,
                    (noteToRemove) => this.removeNote(noteToRemove)
                );
                this.notes.push(note);
                note.render(this.notesContainer);
            });
        }
    }

    addNote() {
        const note = new Note(
            USER_FACING_MESSAGES.EMPTY_NOTE,
            (note) => this.removeNote(note)
        );
        this.notes.push(note);
        note.render(this.notesContainer);
    }

    removeNote(noteToRemove) {
        this.notes = this.notes.filter((note) => note !== noteToRemove);
        noteToRemove.container.remove();

        this.saveNotes();
    }

    saveNotes() {
        const notesData = this.notes.map((note) => note.getData());
        const notesJson = JSON.stringify(notesData);

        localStorage.setItem(STORAGE_KEY, notesJson);

        const currentTime = new Date().toLocaleTimeString();
        this.saveStatus.textContent = `${USER_FACING_MESSAGES.STORED_AT} ${currentTime}`;
    }
}

new WriterApp();