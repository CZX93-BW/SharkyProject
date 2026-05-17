'use strict';

class Game {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameState = new GameState();
        this.renderer = new GameRenderer(canvas);
        this.animationFrameId = null;
    }

    start(levelNumber) {
        this.gameState.start(levelNumber);
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
        cancelAnimationFrame(this.animationFrameId);
    }

    restart() {
        this.gameState.start(this.gameState.currentLevel);
    }

    runGameLoop() {
        this.update();
        this.renderer.render(this.gameState);
        this.animationFrameId = requestAnimationFrame(() => this.runGameLoop());
    }

    update() {
        if (!this.gameState.isRunning || this.gameState.isPaused) {
            return;
        }

        this.movePlayer();
        this.keepPlayerInsideCanvas();
    }

    movePlayer() {
        this.movePlayerHorizontally();
        this.movePlayerVertically();
    }

    movePlayerHorizontally() {
        if (this.keyboard.isMovingLeft()) {
            this.gameState.player.x -= this.gameState.player.speed;
        }

        if (this.keyboard.isMovingRight()) {
            this.gameState.player.x += this.gameState.player.speed;
        }
    }

    movePlayerVertically() {
        if (this.keyboard.isMovingUp()) {
            this.gameState.player.y -= this.gameState.player.speed;
        }

        if (this.keyboard.isMovingDown()) {
            this.gameState.player.y += this.gameState.player.speed;
        }
    }

    keepPlayerInsideCanvas() {
        this.keepPlayerInsideHorizontalBounds();
        this.keepPlayerInsideVerticalBounds();
    }

    keepPlayerInsideHorizontalBounds() {
        const player = this.gameState.player;
        player.x = Math.max(0, player.x);
        player.x = Math.min(this.canvas.width - player.width, player.x);
    }

    keepPlayerInsideVerticalBounds() {
        const player = this.gameState.player;
        player.y = Math.max(0, player.y);
        player.y = Math.min(this.canvas.height - player.height, player.y);
    }
}