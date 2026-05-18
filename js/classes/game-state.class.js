'use strict';

class GameState {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentLevel = 1;
        this.activeLevel = this.getLevelByNumber(1);
        this.coins = 0;
        this.framesPerSecond = 0;
        this.debugMode = this.getDebugMode();
        this.player = this.createPlayer();
    }

    getDebugMode() {
        const searchParameters = new URLSearchParams(window.location.search);
        return searchParameters.get(GAME_CONFIG.debugParameter) === 'true';
    }

    getLevelByNumber(levelNumber) {
        return LEVELS[levelNumber] || LEVELS[1];
    }

    createPlayer() {
        return new Character();
    }

    start(levelNumber) {
        this.currentLevel = levelNumber;
        this.activeLevel = this.getLevelByNumber(levelNumber);
        this.isRunning = true;
        this.isPaused = false;
        this.resetCoins();
        this.resetPlayer();
    }

    pause() {
        if (this.isRunning) {
            this.isPaused = true;
        }
    }

    resume() {
        if (this.isRunning) {
            this.isPaused = false;
        }
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
    }

    resetPlayer() {
        this.player = this.createPlayer();
    }

    resetCoins() {
        this.coins = 0;
    }

    setFramesPerSecond(framesPerSecond) {
        this.framesPerSecond = framesPerSecond;
    }
}