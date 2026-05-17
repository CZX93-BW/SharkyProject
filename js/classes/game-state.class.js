'use strict';

class GameState {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentLevel = 1;
        this.coins = 0;
        this.debugMode = this.getDebugMode();
        this.player = this.createPlayer();
    }

    getDebugMode() {
        const searchParameters = new URLSearchParams(window.location.search);
        return searchParameters.get(GAME_CONFIG.debugParameter) === 'true';
    }

    createPlayer() {
        return {
            x: GAME_CONFIG.playerStartX,
            y: GAME_CONFIG.playerStartY,
            width: GAME_CONFIG.playerWidth,
            height: GAME_CONFIG.playerHeight,
            speed: GAME_CONFIG.playerSpeed
        };
    }

    start(levelNumber) {
        this.currentLevel = levelNumber;
        this.isRunning = true;
        this.isPaused = false;
        this.resetPlayer();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
    }

    resetPlayer() {
        this.player = this.createPlayer();
    }
}