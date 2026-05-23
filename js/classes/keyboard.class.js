'use strict';

class Keyboard {
    constructor() {
        this.pressedKeys = {};
        this.mobileMovement = this.createMobileMovement();
        this.mobileActions = this.createMobileActions();
        this.gameKeys = this.createGameKeys();
        this.bindKeyboardEvents();
    }

    createMobileMovement() {
        return {
            x: 0,
            y: 0
        };
    }

    createMobileActions() {
        return {
            slap: false,
            bubble: false,
            poison: false
        };
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
            'KeyE',
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

    setMobileMovement(x, y) {
        this.mobileMovement.x = x;
        this.mobileMovement.y = y;
    }

    resetMobileMovement() {
        this.mobileMovement = this.createMobileMovement();
    }

    setMobileAction(actionName, isPressed) {
        this.mobileActions[actionName] = isPressed;
    }

    isMovingLeft() {
        return this.isKeyPressed('ArrowLeft') ||
            this.isKeyPressed('KeyA') ||
            this.isMobileMovingLeft();
    }

    isMovingRight() {
        return this.isKeyPressed('ArrowRight') ||
            this.isKeyPressed('KeyD') ||
            this.isMobileMovingRight();
    }

    isMovingUp() {
        return this.isKeyPressed('ArrowUp') ||
            this.isKeyPressed('KeyW') ||
            this.isMobileMovingUp();
    }

    isMovingDown() {
        return this.isKeyPressed('ArrowDown') ||
            this.isKeyPressed('KeyS') ||
            this.isMobileMovingDown();
    }

    isKeyPressed(keyCode) {
        return Boolean(this.pressedKeys[keyCode]);
    }

    isMobileMovingLeft() {
        return this.mobileMovement.x < -GAME_CONFIG.mobileJoystickThreshold;
    }

    isMobileMovingRight() {
        return this.mobileMovement.x > GAME_CONFIG.mobileJoystickThreshold;
    }

    isMobileMovingUp() {
        return this.mobileMovement.y < -GAME_CONFIG.mobileJoystickThreshold;
    }

    isMobileMovingDown() {
        return this.mobileMovement.y > GAME_CONFIG.mobileJoystickThreshold;
    }

    isFinSlapPressed() {
        return this.isKeyPressed('KeyE') || this.mobileActions.slap;
    }

    isBubbleAttackPressed() {
        return this.isKeyPressed('Space') || this.mobileActions.bubble;
    }

    isPoisonAttackPressed() {
        return this.isKeyPressed('KeyF') || this.mobileActions.poison;
    }
}