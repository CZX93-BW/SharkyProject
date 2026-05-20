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
        this.endboss = levelData.endboss || null;
        this.finishObject = levelData.finishObject || null;
    }

    update() {
        this.updateEnemies();
        this.updateEndboss();
    }

    updateEnemies() {
        this.enemies.forEach((enemy) => enemy.update());
    }

    updateEndboss() {
        if (this.endboss) {
            this.endboss.update();
        }
    }

    reset() {
        this.resetEnemies();
        this.resetCollectibles();
        this.resetEndboss();
    }

    resetEnemies() {
        this.enemies.forEach((enemy) => enemy.reset());
    }

    resetCollectibles() {
        this.collectibles.forEach((collectible) => collectible.reset());
    }

    resetEndboss() {
        if (this.endboss) {
            this.endboss.reset();
        }
    }

    getActiveCollectibles() {
        return this.collectibles.filter((collectible) => !collectible.isCollected);
    }

    getDangerObjects() {
        const dangerObjects = [...this.enemies];

        if (this.hasActiveEndboss()) {
            dangerObjects.push(this.endboss);
        }

        return dangerObjects;
    }

    hasActiveEndboss() {
        return this.endboss && !this.endboss.isDefeated;
    }

    isLevelComplete(player) {
        return this.finishObject && this.finishObject.isReachedBy(player);
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