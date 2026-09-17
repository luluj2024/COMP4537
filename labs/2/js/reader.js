/*
 * AI Disclosure:
 * ChatGPT was used to help explain JavaScript concepts, and design the OOP structure for this assignment.
 * I reviewed, understood, and tested the submitted code.
 */

import { USER_FACING_MESSAGES } from "../lang/messages/en/user.js";

const STORAGE_KEY = "notes";
const RETRIEVE_INTERVAL_MS = 2000;

class ReaderApp {
    constructor() {
        this.notesContainer = document.getElementById("notes-container");
        this.retrieveStatus = document.getElementById("retrieve-status");
        this.backButton = document.getElementById("back-button");
        this.backButton.textContent = USER_FACING_MESSAGES.BACK_BUTTON;

        this.backButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });

        document.title = USER_FACING_MESSAGES.PAGE_TITLE;

        this.loadNotes();

        setInterval(() => {
            this.loadNotes();
        }, RETRIEVE_INTERVAL_MS);
    }

    loadNotes() {
        const notesJson = localStorage.getItem(STORAGE_KEY);

        this.notesContainer.innerHTML = USER_FACING_MESSAGES.EMPTY_NOTE;

        if (notesJson) {
            const notesData = JSON.parse(notesJson);
            notesData.forEach((noteData) => {
                const noteElement = document.createElement("textarea");
                noteElement.value = noteData.content;
                noteElement.readOnly = true;
                this.notesContainer.appendChild(noteElement);
            });
        }

        const currentTime = new Date().toLocaleTimeString();
        this.retrieveStatus.textContent = `${USER_FACING_MESSAGES.UPDATED_AT} ${currentTime}`;
    }
}

new ReaderApp();