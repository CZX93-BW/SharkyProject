'use strict';

class Level {
    constructor(levelData) {
        this.number = levelData.number;
        this.config = levelData.config;
        this.width = levelData.width;
        this.height = levelData.height;
        this.backgroundObjects = levelData.backgroundObjects || [];
        this.barrierObjects = levelData.barrierObjects || [];
        this.solidAreas = this.createSolidAreas(levelData.solidAreas || []);
        this.enemies = levelData.enemies || [];
        this.collectibles = levelData.collectibles || [];
        this.endboss = levelData.endboss || null;
        this.finishObject = levelData.finishObject || null;
        this.updateFinishState();
    }

    createSolidAreas(baseSolidAreas) {
        const barrierAreas = this.barrierObjects.map((barrier) => {
            return barrier.getSolidArea();
        });

        return [...baseSolidAreas, ...barrierAreas];
    }

    update(player = null) {
        this.updateEnemies(player);
        this.updateCollectibles();
        this.updateEndboss(player);
        this.updateFinishState();
    }

    updateEnemies(player = null) {
        this.enemies.forEach((enemy) => {
            enemy.update(this.solidAreas, player);
        });
    }

    updateCollectibles() {
        this.collectibles.forEach((collectible) => collectible.update());
    }

    updateEndboss(player = null) {
        if (this.endboss) {
            this.endboss.update(player);
        }
    }

    reset() {
        this.resetEnemies();
        this.resetCollectibles();
        this.resetEndboss();
        this.updateFinishState();
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
        return this.getAttackTargets().filter((enemy) => enemy.canDealContactDamage());
    }

    getAttackTargets() {
        const targets = this.enemies.filter((enemy) => !enemy.isDefeated);

        if (this.hasActiveEndboss()) {
            targets.push(this.endboss);
        }

        return targets;
    }

    hasActiveEndboss() {
        return this.endboss &&
            this.endboss.hasBeenIntroduced &&
            !this.endboss.isIntroducing &&
            !this.endboss.isDefeated;
    }

    isLevelComplete(player) {
        return this.isFinishUnlocked() &&
            this.finishObject.isReachedBy(player);
    }

    isFinishUnlocked() {
        return Boolean(this.finishObject) && this.finishObject.isUnlocked;
    }

    updateFinishState() {
        if (!this.finishObject) {
            return;
        }

        const isUnlocked = !this.endboss || this.endboss.isDefeated;
        this.finishObject.setUnlocked(isUnlocked);
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