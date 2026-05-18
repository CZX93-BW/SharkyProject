'use strict';

class Game {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameState = new GameState();
        this.renderer = new GameRenderer(canvas);
        this.camera = new Camera(canvas);
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        this.renderer.render(this.gameState, this.camera);
    }

    start(levelNumber) {
        this.cancelRunningLoop();
        this.gameState.start(levelNumber);
        this.camera.reset();
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
        this.camera.reset();
        this.renderer.render(this.gameState, this.camera);
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
        this.renderer.render(this.gameState, this.camera);
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

        this.updatePlayer();
        this.updateCamera();
    }

    updatePlayer() {
        const levelBounds = this.gameState.activeLevel.getBounds();
        this.gameState.player.update(this.keyboard, levelBounds);
    }

    updateCamera() {
        this.camera.update(this.gameState.player, this.gameState.activeLevel);
    }

    canUpdateGame() {
        return this.gameState.isRunning && !this.gameState.isPaused;
    }
}