'use strict';

class Level {
    constructor(levelData) {
        this.number = levelData.number;
        this.width = levelData.width;
        this.height = levelData.height;
        this.backgroundObjects = levelData.backgroundObjects || [];
        this.solidAreas = levelData.solidAreas || [];
        this.enemies = levelData.enemies || [];
        this.collectibles = levelData.collectibles || [];
    }

    update() {
        this.updateEnemies();
    }

    updateEnemies() {
        this.enemies.forEach((enemy) => enemy.update());
    }

    reset() {
        this.resetEnemies();
        this.resetCollectibles();
    }

    resetEnemies() {
        this.enemies.forEach((enemy) => enemy.reset());
    }

    resetCollectibles() {
        this.collectibles.forEach((collectible) => collectible.reset());
    }

    getActiveCollectibles() {
        return this.collectibles.filter((collectible) => !collectible.isCollected);
    }

    getBounds() {
        return {
            left: 0,
            top: 0,
            right: this.width,
            bottom: this.height
        };
    }

    getMaxCameraX(canvasWidth) {
        return Math.max(0, this.width - canvasWidth);
    }

    getMaxCameraY(canvasHeight) {
        return Math.max(0, this.height - canvasHeight);
    }
}