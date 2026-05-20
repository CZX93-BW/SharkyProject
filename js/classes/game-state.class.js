'use strict';

class GameState {
    constructor() {
        this.status = 'menu';
        this.isRunning = false;
        this.isPaused = false;
        this.currentLevel = 1;
        this.activeLevel = this.getLevelByNumber(1);
        this.coins = 0;
        this.poisonBottles = 0;
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
        this.status = 'playing';
        this.isRunning = true;
        this.isPaused = false;
        this.resetResources();
        this.resetPlayer();
        this.resetLevel();
    }

    pause() {
        if (this.isRunning) {
            this.isPaused = true;
            this.status = 'paused';
        }
    }

    resume() {
        if (this.isRunning) {
            this.isPaused = false;
            this.status = 'playing';
        }
    }

    stop() {
        this.status = 'menu';
        this.isRunning = false;
        this.isPaused = false;
    }

    completeLevel() {
        this.status = 'levelComplete';
        this.isRunning = false;
        this.isPaused = false;
    }

    setGameOver() {
        this.status = 'gameOver';
        this.isRunning = false;
        this.isPaused = false;
    }

    resetPlayer() {
        this.player = this.createPlayer();
    }

    resetLevel() {
        this.activeLevel.reset();
    }

    resetResources() {
        this.coins = 0;
        this.poisonBottles = 0;
    }

    collectCoin(value) {
        this.coins += value;
    }

    collectPoisonBottle(value) {
        const nextValue = this.poisonBottles + value;
        this.poisonBottles = Math.min(nextValue, GAME_CONFIG.playerMaxPoisonBottles);
    }

    setFramesPerSecond(framesPerSecond) {
        this.framesPerSecond = framesPerSecond;
    }
}