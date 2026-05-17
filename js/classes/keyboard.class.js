'use strict';

class Keyboard {
    constructor() {
        this.pressedKeys = {};
        this.bindKeyboardEvents();
    }

    bindKeyboardEvents() {
        window.addEventListener('keydown', (event) => this.setKeyState(event, true));
        window.addEventListener('keyup', (event) => this.setKeyState(event, false));
    }

    setKeyState(event, isPressed) {
        this.pressedKeys[event.code] = isPressed;
    }

    isMovingLeft() {
        return this.pressedKeys.ArrowLeft || this.pressedKeys.KeyA;
    }

    isMovingRight() {
        return this.pressedKeys.ArrowRight || this.pressedKeys.KeyD;
    }

    isMovingUp() {
        return this.pressedKeys.ArrowUp || this.pressedKeys.KeyW;
    }

    isMovingDown() {
        return this.pressedKeys.ArrowDown || this.pressedKeys.KeyS;
    }
}