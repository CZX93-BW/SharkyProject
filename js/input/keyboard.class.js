'use strict';

/** Combines keyboard and mobile inputs into one normalized game input state. */
class Keyboard {
    /** Creates all input states and registers keyboard lifecycle listeners. */
    constructor() {
        this.pressedKeys = {};
        this.mobileMovement = this.createMobileMovement();
        this.mobileActions = this.createMobileActions();
        this.gameKeys = this.createGameKeys();
        this.bindKeyboardEvents();
        this.bindInputLifecycleEvents();
    }

    /** @returns {Object} Neutral two-axis mobile movement state. */
    createMobileMovement() {
        return {
            x: 0,
            y: 0
        };
    }

    /** @returns {Object} Released state for all mobile attack actions. */
    createMobileActions() {
        return {
            slap: false,
            bubble: false,
            poison: false
        };
    }

    /** @returns {string[]} Keyboard codes controlled by the game. */
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

    /** Registers keyboard press and release listeners. */
    bindKeyboardEvents() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    /** Clears inputs when the browser can no longer report key releases. */
    bindInputLifecycleEvents() {
        window.addEventListener('blur', () => this.resetAllInputs());
        document.addEventListener(
            'visibilitychange',
            () => this.handleVisibilityChange()
        );
    }

    /** Clears input after the document becomes hidden. */
    handleVisibilityChange() {
        if (document.hidden) {
            this.resetAllInputs();
        }
    }

    /** @param {KeyboardEvent} event - Browser key-down event. */
    handleKeyDown(event) {
        this.preventBrowserMovement(event);
        this.setKeyState(event.code, true);
    }

    /** @param {KeyboardEvent} event - Browser key-up event. */
    handleKeyUp(event) {
        this.preventBrowserMovement(event);
        this.setKeyState(event.code, false);
    }

    /** @param {KeyboardEvent} event - Keyboard event to inspect. */
    preventBrowserMovement(event) {
        if (this.isGameKey(event.code)) {
            event.preventDefault();
        }
    }

    /**
     * @param {string} keyCode - Browser keyboard code.
     * @returns {boolean} Whether the code belongs to a game control.
     */
    isGameKey(keyCode) {
        return this.gameKeys.includes(keyCode);
    }

    /**
     * @param {string} keyCode - Browser keyboard code.
     * @param {boolean} isPressed - Whether the key is currently pressed.
     */
    setKeyState(keyCode, isPressed) {
        this.pressedKeys[keyCode] = isPressed;
    }

    /**
     * @param {number} x - Normalized horizontal movement value.
     * @param {number} y - Normalized vertical movement value.
     */
    setMobileMovement(x, y) {
        this.mobileMovement.x = x;
        this.mobileMovement.y = y;
    }

    /** Restores the neutral mobile movement state. */
    resetMobileMovement() {
        this.mobileMovement = this.createMobileMovement();
    }

    /** Releases keyboard, joystick and mobile attack states together. */
    resetAllInputs() {
        this.pressedKeys = {};
        this.mobileMovement = this.createMobileMovement();
        this.mobileActions = this.createMobileActions();
    }

    /**
     * @param {string} actionName - Mobile attack action name.
     * @param {boolean} isPressed - Whether the action is currently pressed.
     */
    setMobileAction(actionName, isPressed) {
        this.mobileActions[actionName] = isPressed;
    }

    /** @returns {boolean} Whether leftward movement is active. */
    isMovingLeft() {
        return this.isKeyPressed('ArrowLeft') ||
            this.isKeyPressed('KeyA') ||
            this.isMobileMovingLeft();
    }

    /** @returns {boolean} Whether rightward movement is active. */
    isMovingRight() {
        return this.isKeyPressed('ArrowRight') ||
            this.isKeyPressed('KeyD') ||
            this.isMobileMovingRight();
    }

    /** @returns {boolean} Whether upward movement is active. */
    isMovingUp() {
        return this.isKeyPressed('ArrowUp') ||
            this.isKeyPressed('KeyW') ||
            this.isMobileMovingUp();
    }

    /** @returns {boolean} Whether downward movement is active. */
    isMovingDown() {
        return this.isKeyPressed('ArrowDown') ||
            this.isKeyPressed('KeyS') ||
            this.isMobileMovingDown();
    }

    /**
     * @param {string} keyCode - Browser keyboard code.
     * @returns {boolean} Whether the key is currently pressed.
     */
    isKeyPressed(keyCode) {
        return Boolean(this.pressedKeys[keyCode]);
    }

    /** @returns {boolean} Whether mobile movement passes the left threshold. */
    isMobileMovingLeft() {
        return this.mobileMovement.x < -GAME_CONFIG.mobileJoystickThreshold;
    }

    /** @returns {boolean} Whether mobile movement passes the right threshold. */
    isMobileMovingRight() {
        return this.mobileMovement.x > GAME_CONFIG.mobileJoystickThreshold;
    }

    /** @returns {boolean} Whether mobile movement passes the upper threshold. */
    isMobileMovingUp() {
        return this.mobileMovement.y < -GAME_CONFIG.mobileJoystickThreshold;
    }

    /** @returns {boolean} Whether mobile movement passes the lower threshold. */
    isMobileMovingDown() {
        return this.mobileMovement.y > GAME_CONFIG.mobileJoystickThreshold;
    }

    /** @returns {boolean} Whether the Fin Slap input is active. */
    isFinSlapPressed() {
        return this.isKeyPressed('KeyE') || this.mobileActions.slap;
    }

    /** @returns {boolean} Whether the Bubble Trap input is active. */
    isBubbleAttackPressed() {
        return this.isKeyPressed('Space') || this.mobileActions.bubble;
    }

    /** @returns {boolean} Whether the Poison Shot input is active. */
    isPoisonAttackPressed() {
        return this.isKeyPressed('KeyF') || this.mobileActions.poison;
    }
}