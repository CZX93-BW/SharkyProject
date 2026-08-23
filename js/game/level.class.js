'use strict';

/** Manages all static and dynamic objects belonging to one game level. */
class Level {
    /** @param {Object} levelData - Complete configured level data. */
    constructor(levelData) {
        this.initializeDimensions(levelData);
        this.initializeWorldObjects(levelData);
        this.initializeGameplayObjects(levelData);
        this.enemySpawner = levelData.enemySpawner || this.createEnemySpawner();
        this.updateFinishState();
    }

    /** @param {Object} levelData - Configured level dimensions and identity. */
    initializeDimensions(levelData) {
        this.number = levelData.number;
        this.config = levelData.config;
        this.width = levelData.width;
        this.height = levelData.height;
    }

    /** @param {Object} levelData - Configured world-layer collections. */
    initializeWorldObjects(levelData) {
        this.backgroundObjects = levelData.backgroundObjects || [];
        this.barrierObjects = levelData.barrierObjects || [];
        this.solidAreas = this.createSolidAreas(levelData.solidAreas || []);
    }

    /** @param {Object} levelData - Configured gameplay object collections. */
    initializeGameplayObjects(levelData) {
        this.enemies = levelData.enemies || [];
        this.collectibles = levelData.collectibles || [];
        this.endboss = levelData.endboss || null;
        this.finishObject = levelData.finishObject || null;
    }

    /** @returns {EnemySpawner|null} Configured dynamic enemy spawner. */
    createEnemySpawner() {
        if (!this.config?.spawner) {
            return null;
        }
        return new EnemySpawner(this);
    }

    /**
     * @param {Object[]} baseSolidAreas - Explicit level collision areas.
     * @returns {Object[]} Combined explicit and barrier collision areas.
     */
    createSolidAreas(baseSolidAreas) {
        const barrierAreas = this.barrierObjects.map((barrier) => {
            return barrier.getSolidArea();
        });
        return [...baseSolidAreas, ...barrierAreas];
    }

    /**
     * Updates every dynamic level object for one game frame.
     *
     * @param {Character|null} [player=null] - Current player character.
     * @param {Object|null} [visibleBounds=null] - Camera-visible world area.
     */
    update(player = null, visibleBounds = null) {
        this.updateEnemies(player);
        this.updateCollectibles();
        this.updateEndboss(player);
        this.updateEnemySpawner(player, visibleBounds);
        this.updateFinishState();
    }

    /**
     * @param {Character|null} player - Current player character.
     * @param {Object|null} visibleBounds - Camera-visible world area.
     */
    updateEnemySpawner(player, visibleBounds) {
        if (this.enemySpawner) {
            this.enemySpawner.update(player, visibleBounds);
        }
    }

    /** @param {Character|null} [player=null] - Current player character. */
    updateEnemies(player = null) {
        this.enemies.forEach((enemy) => {
            enemy.update(this.solidAreas, player);
        });
    }

    /** Updates every collectible animation. */
    updateCollectibles() {
        this.collectibles.forEach((collectible) => collectible.update());
    }

    /** @param {Character|null} [player=null] - Current player character. */
    updateEndboss(player = null) {
        if (this.endboss) {
            this.endboss.update(player, this.solidAreas, this.getBounds());
        }
    }

    /** Restores all mutable level objects for a new attempt. */
    reset() {
        this.resetEnemies();
        this.resetCollectibles();
        this.resetEndboss();
        this.updateFinishState();
    }

    /** Restores static enemies or resets the dynamic enemy spawner. */
    resetEnemies() {
        if (this.enemySpawner) {
            this.enemySpawner.reset();
            return;
        }
        this.enemies.forEach((enemy) => enemy.reset());
    }

    /** Restores all collectibles. */
    resetCollectibles() {
        this.collectibles.forEach((collectible) => collectible.reset());
    }

    /** Restores the level boss when one exists. */
    resetEndboss() {
        if (this.endboss) {
            this.endboss.reset();
        }
    }

    /** @returns {CollectibleObject[]} All collectibles not yet collected. */
    getActiveCollectibles() {
        return this.collectibles.filter((collectible) => {
            return !collectible.isCollected;
        });
    }

    /** @returns {Object|null} Dynamic spawn counters for debugging and tests. */
    getEnemySpawnerStats() {
        return this.enemySpawner?.getStats() || null;
    }

    /** @returns {Enemy[]} Active objects able to deal contact damage. */
    getDangerObjects() {
        return this.getAttackTargets().filter((enemy) => {
            return enemy.canDealContactDamage();
        });
    }

    /** @returns {Enemy[]} Active standard enemies and introduced boss targets. */
    getAttackTargets() {
        const targets = this.enemies.filter((enemy) => !enemy.isDefeated);
        if (this.hasActiveEndboss()) {
            targets.push(this.endboss);
        }
        return targets;
    }

    /** @returns {boolean} Whether the boss is currently a valid target. */
    hasActiveEndboss() {
        return this.endboss &&
            this.endboss.hasBeenIntroduced &&
            !this.endboss.isIntroducing &&
            !this.endboss.isDefeated;
    }

    /**
     * @param {Character} player - Current player character.
     * @returns {boolean} Whether the player reached an unlocked finish.
     */
    isLevelComplete(player) {
        return this.isFinishUnlocked() &&
            this.finishObject.isReachedBy(player);
    }

    /** @returns {boolean} Whether the configured finish is unlocked. */
    isFinishUnlocked() {
        return Boolean(this.finishObject) && this.finishObject.isUnlocked;
    }

    /** Synchronizes the finish lock with the boss defeat state. */
    updateFinishState() {
        if (!this.finishObject) {
            return;
        }
        const isUnlocked = !this.endboss || this.endboss.isDefeated;
        this.finishObject.setUnlocked(isUnlocked);
    }

    /** @returns {Object} Complete rectangular movement boundaries. */
    getBounds() {
        return {
            left: 0,
            top: 0,
            right: this.width,
            bottom: this.height
        };
    }

    /**
     * @param {number} canvasWidth - Visible canvas width.
     * @returns {number} Furthest valid horizontal camera position.
     */
    getMaxCameraX(canvasWidth) {
        return Math.max(0, this.width - canvasWidth);
    }

    /**
     * @param {number} canvasHeight - Visible canvas height.
     * @returns {number} Furthest valid vertical camera position.
     */
    getMaxCameraY(canvasHeight) {
        return Math.max(0, this.height - canvasHeight);
    }
}