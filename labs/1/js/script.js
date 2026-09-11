/*
 * AI Disclosure:
 * ChatGPT was used to help explain JavaScript concepts, and design the OOP structure for this assignment.
 * I reviewed, understood, and tested the submitted code.
 */

import { USER_MESSAGES } from "../lang/messages/en/user.js";

class MemoryButton {
    constructor(number) {
        this.number = number;
        this.element = document.createElement("button");
        this.element.classList.add("memory-button");

        this.element.textContent = this.number;
        this.element.style.backgroundColor = this.generateRandomColor();

        this.disable();
    }

    generateRandomColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        return `rgb(${red}, ${green}, ${blue})`;
    }

    showNumber() {
        this.element.textContent = this.number;
    }

    hideNumber() {
        this.element.textContent = "";
    }

    enable() {
        this.element.disabled = false;
    }

    disable() {
        this.element.disabled = true;
    }

    moveRandomly() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const buttonWidth = this.element.offsetWidth;
        const buttonHeight = this.element.offsetHeight;

        const maxX = windowWidth - buttonWidth;
        const maxY = windowHeight - buttonHeight;

        const randomX = Math.floor(Math.random() * Math.max(0, maxX));
        const randomY = Math.floor(Math.random() * Math.max(0, maxY));

        this.element.style.position = "fixed";
        this.element.style.left = `${randomX}px`;
        this.element.style.top = `${randomY}px`;
    }
}

class UserInterface {
    constructor() {
        this.controls = document.getElementById("controls");
        this.message = document.getElementById("message");
        this.gameArea = document.getElementById("game-area");

        this.input = null;
        this.goButton = null;
    }

    createControls() {
        document.title = USER_MESSAGES.PAGE_TITLE;
        
        const label = document.createElement("label");
        label.textContent = USER_MESSAGES.INPUT_LABEL;

        this.input = document.createElement("input");
        this.input.type = "number";
        this.input.min = "3";
        this.input.max = "7";

        this.goButton = document.createElement("button");
        this.goButton.textContent = USER_MESSAGES.GO_BUTTON;

        this.controls.appendChild(label);
        this.controls.appendChild(this.input);
        this.controls.appendChild(this.goButton);
    }

    getButtonCount() {
        return Number(this.input.value);
    }

    showMessage(message){
        this.message.textContent = message;
    }

    clearMessage() {
        this.message.textContent = "";
    }

    clearGameArea() {
        this.gameArea.innerHTML = "";
    }
}

class MemoryGame {
    constructor(ui) {
        this.ui = ui;
        this.buttons = [];
        this.expectedIndex = 0;
        this.isPlaying = false;
        this.gameId = 0;
    }

    createButtons(count) {
        this.buttons = [];
        this.ui.clearGameArea();

        for(let i = 1; i <= count; i++) {
            const memoryButton = new MemoryButton(i);

            this.buttons.push(memoryButton);
            this.ui.gameArea.appendChild(memoryButton.element);
        }
    }

    delay(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    scrambleButtons() {
        for (const button of this.buttons){
            button.moveRandomly();
        }
    }

    prepareForGuessing() {
        this.expectedIndex = 0;
        this.isPlaying = true;

        for(const button of this.buttons) {
            button.hideNumber();
            button.enable();

            button.element.addEventListener("click", () => {
                this.handleButtonClick(button);
            });
        }
    }

    handleButtonClick(button) {
        if(!this.isPlaying){
            return;
        }

        const expectedButton = this.buttons[this.expectedIndex];

        if(button === expectedButton) {
            button.showNumber();
            button.disable();

            this.expectedIndex++;

            if(this.expectedIndex === this.buttons.length) {
                this.ui.showMessage(USER_MESSAGES.EXCELLENT_MEMORY);
                this.endGame();
            }
        } else {
            this.ui.showMessage(USER_MESSAGES.WRONG_ORDER);
            this.revealAllButtons();
            this.endGame();
        }
    }

    revealAllButtons(){
        for (const button of this.buttons){
            button.showNumber();
        }
    }

    cancelCurrentGame() {
    this.gameId++;
    this.isPlaying = false;
    this.buttons = [];
    this.ui.clearGameArea();
    }

    endGame() {
        this.isPlaying = false;

        for (const button of this.buttons) {
            button.disable();
        }
    }

    async startGame(count) {
        this.gameId++;
        const currentGameId = this.gameId;

        this.createButtons(count);

        await this.delay(count * 1000);

        if (currentGameId !== this.gameId){
            return;
        }

        for (let i = 0; i < count; i++){
            this.scrambleButtons();

            if(i < count - 1){
                await this.delay(2000);

                if(currentGameId !== this.gameId){
                    return;
                }
            }
        }

        this.prepareForGuessing();
    }
}


class AppController {
    constructor() {
        this.ui = new UserInterface();
        this.game = new MemoryGame(this.ui);
    }

    start() {
        this.ui.createControls();
        this.ui.goButton.addEventListener("click", () => {
            this.startNewGame();
        });
    }

    startNewGame() {
        this.game.cancelCurrentGame();
        
        const count = this.ui.getButtonCount();

        if(!this.isValidInput(count)){
            this.ui.showMessage(USER_MESSAGES.INVALID_INPUT);
            return;
        }

        this.ui.clearMessage();
        this.game.startGame(count);
    }

    isValidInput(count){
        return Number.isInteger(count) && count >= 3 && count <= 7;
    }
}

const app = new AppController();
app.start();