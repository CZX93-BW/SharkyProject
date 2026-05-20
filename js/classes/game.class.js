'use strict';

class Game {
    constructor(canvas, keyboard, statusUpdateCallback = null) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.statusUpdateCallback = statusUpdateCallback;
        this.gameState = new GameState();
        this.renderer = new GameRenderer(canvas);
        this.camera = new Camera(canvas);
        this.collisionManager = new CollisionManager();
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        this.renderer.render(this.gameState, this.camera);
        this.notifyStatusUpdate();
    }

    start(levelNumber) {
        this.cancelRunningLoop();
        this.gameState.start(levelNumber);
        this.camera.reset();
        this.resetFrameTime();
        this.notifyStatusUpdate();
        this.runGameLoop();
    }

    pause() {
        this.gameState.pause();
        this.notifyStatusUpdate();
    }

    resume() {
        this.gameState.resume();
        this.notifyStatusUpdate();
    }

    stop() {
        this.gameState.stop();
        this.cancelRunningLoop();
        this.camera.reset();
        this.renderer.render(this.gameState, this.camera);
        this.notifyStatusUpdate();
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
        this.notifyStatusUpdate();

        if (this.shouldContinueLoop()) {
            this.requestNextFrame();
        }
    }

    shouldContinueLoop() {
        return this.gameState.isRunning;
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
        this.updateLevel();
        this.updateCollisions();
        this.updateGameStatus();
        this.updateCamera();
    }

    updatePlayer() {
        const levelBounds = this.gameState.activeLevel.getBounds();
        this.gameState.player.update(this.keyboard, levelBounds);
    }

    updateLevel() {
        this.gameState.activeLevel.update();
    }

    updateCollisions() {
        this.checkEnemyCollisions();
        this.checkCollectibleCollisions();
    }

    checkEnemyCollisions() {
        this.collisionManager.checkPlayerEnemyCollisions(
            this.gameState.player,
            this.gameState.activeLevel.enemies
        );
    }

    checkCollectibleCollisions() {
        this.collisionManager.checkPlayerCollectibleCollisions(this.gameState);
    }

    updateGameStatus() {
        if (!this.gameState.player.isAlive()) {
            this.gameState.setGameOver();
            return;
        }

        this.completeLevelIfNeeded();
    }

    completeLevelIfNeeded() {
        if (this.hasReachedLevelEnd()) {
            this.gameState.completeLevel();
        }
    }

    hasReachedLevelEnd() {
        const levelEnd = this.gameState.activeLevel.width - GAME_CONFIG.levelFinishDistance;
        return this.gameState.player.getRightSide() >= levelEnd;
    }

    updateCamera() {
        this.camera.update(this.gameState.player, this.gameState.activeLevel);
    }

    canUpdateGame() {
        return this.gameState.isRunning &&
            !this.gameState.isPaused &&
            this.gameState.status === 'playing';
    }

    notifyStatusUpdate() {
        if (this.statusUpdateCallback) {
            this.statusUpdateCallback(this.gameState);
        }
    }
}