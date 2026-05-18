'use strict';

class Keyboard {
    constructor() {
        this.pressedKeys = {};
        this.gameKeys = this.createGameKeys();
        this.bindKeyboardEvents();
    }

    createGameKeys() {
        return [
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'KeyA',
            'KeyD',
            'KeyW',
            'KeyS',
            'Space',
            'KeyF'
        ];
    }

    bindKeyboardEvents() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        this.preventBrowserMovement(event);
        this.setKeyState(event.code, true);
    }

    handleKeyUp(event) {
        this.preventBrowserMovement(event);
        this.setKeyState(event.code, false);
    }

    preventBrowserMovement(event) {
        if (this.isGameKey(event.code)) {
            event.preventDefault();
        }
    }

    isGameKey(keyCode) {
        return this.gameKeys.includes(keyCode);
    }

    setKeyState(keyCode, isPressed) {
        this.pressedKeys[keyCode] = isPressed;
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

    isBubbleAttackPressed() {
        return this.pressedKeys.Space;
    }

    isPoisonAttackPressed() {
        return this.pressedKeys.KeyF;
    }
}