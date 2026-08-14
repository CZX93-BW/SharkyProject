'use strict';

class Level {
    constructor(levelData) {
        this.number = levelData.number;
        this.width = levelData.width;
        this.height = levelData.height;

        this.backgroundObjects =
            levelData.backgroundObjects || [];

        this.solidAreas =
            levelData.solidAreas || [];

        this.enemies =
            levelData.enemies || [];

        this.collectibles =
            levelData.collectibles || [];

        this.endboss =
            levelData.endboss || null;

        this.finishObject =
            levelData.finishObject || null;
    }

    /** Updates all dynamic level objects. */
    update(player = null) {
        this.updateEnemies();
        this.updateEndboss(player);
    }

    updateEnemies() {
        this.enemies.forEach((enemy) => {
            enemy.update();
        });
    }

    /** Updates the boss with optional player information. */
    updateEndboss(player = null) {
        if (this.endboss) {
            this.endboss.update(player);
        }
    }

    reset() {
        this.resetEnemies();
        this.resetCollectibles();
        this.resetEndboss();
    }

    resetEnemies() {
        this.enemies.forEach((enemy) => {
            enemy.reset();
        });
    }

    resetCollectibles() {
        this.collectibles.forEach((collectible) => {
            collectible.reset();
        });
    }

    resetEndboss() {
        if (this.endboss) {
            this.endboss.reset();
        }
    }

    getActiveCollectibles() {
        return this.collectibles.filter(
            (collectible) => {
                return !collectible.isCollected;
            }
        );
    }

    getDangerObjects() {
        return this.getAttackTargets().filter(
            (enemy) => {
                return enemy.canDealContactDamage();
            }
        );
    }

    getAttackTargets() {
        const targets = this.enemies.filter(
            (enemy) => {
                return !enemy.isDefeated;
            }
        );

        if (this.hasActiveEndboss()) {
            targets.push(this.endboss);
        }

        return targets;
    }

    hasActiveEndboss() {
        return this.endboss &&
            !this.endboss.isDefeated;
    }

    isLevelComplete(player) {
        return this.finishObject &&
            this.finishObject.isReachedBy(player);
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
        return Math.max(
            0,
            this.width - canvasWidth
        );
    }

    getMaxCameraY(canvasHeight) {
        return Math.max(
            0,
            this.height - canvasHeight
        );
    }
}