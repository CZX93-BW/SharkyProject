'use strict';

class Game {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameState = new GameState();
        this.renderer = new GameRenderer(canvas);
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        this.renderer.render(this.gameState);
    }

    start(levelNumber) {
        this.cancelRunningLoop();
        this.gameState.start(levelNumber);
        this.resetFrameTime();
        this.runGameLoop();
    }

    pause() {
        this.gameState.pause();
    }

    resume() {
        this.gameState.resume();
    }

    stop() {
        this.gameState.stop();
        this.cancelRunningLoop();
        this.renderer.render(this.gameState);
    }

    restart() {
        this.start(this.gameState.currentLevel);
    }

    cancelRunningLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.animationFrameId = null;
    }

    resetFrameTime() {
        this.lastFrameTime = 0;
        this.gameState.setFramesPerSecond(0);
    }

    runGameLoop(currentTime = 0) {
        this.updateFrameData(currentTime);
        this.update();
        this.renderer.render(this.gameState);
        this.requestNextFrame();
    }

    requestNextFrame() {
        this.animationFrameId = requestAnimationFrame(
            (currentTime) => this.runGameLoop(currentTime)
        );
    }

    updateFrameData(currentTime) {
        if (this.lastFrameTime > 0) {
            this.updateFramesPerSecond(currentTime);
        }

        this.lastFrameTime = currentTime;
    }

    updateFramesPerSecond(currentTime) {
        const frameDuration = currentTime - this.lastFrameTime;
        const framesPerSecond = Math.round(1000 / frameDuration);

        this.gameState.setFramesPerSecond(framesPerSecond);
    }

    update() {
        if (!this.canUpdateGame()) {
            return;
        }

        this.gameState.player.update(this.keyboard, this.getCanvasBounds());
    }

    canUpdateGame() {
        return this.gameState.isRunning && !this.gameState.isPaused;
    }

    getCanvasBounds() {
        return {
            left: 0,
            top: 0,
            right: this.canvas.width,
            bottom: this.canvas.height
        };
    }
}