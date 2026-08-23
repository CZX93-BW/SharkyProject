'use strict';

/** Stores session progress, level state, upgrades, and runtime status values. */
class GameState {
    /** Creates the initial menu state and first-level game objects. */
    constructor() {
        this.initializeRuntimeState();
        this.initializeSessionState();
        this.debugMode = this.getDebugMode();
        this.player = this.createPlayer();
    }

    /** Initializes lifecycle and level runtime values. */
    initializeRuntimeState() {
        this.status = 'menu';
        this.isRunning = false;
        this.isPaused = false;
        this.currentLevel = 1;
        this.activeLevel = this.getLevelByNumber(1);
        this.framesPerSecond = 0;
    }

    /** Initializes collectible inventory and shop progress. */
    initializeSessionState() {
        this.coins = 0;
        this.poisonBottles = 0;
        this.upgrades = this.createDefaultUpgrades();
    }

    /** @returns {boolean} Whether URL-based debug mode is enabled. */
    getDebugMode() {
        const searchParameters = new URLSearchParams(window.location.search);
        return searchParameters.get(GAME_CONFIG.debugParameter) === 'true';
    }

    /**
     * @param {number|string} levelNumber - Requested level identifier.
     * @returns {Level} Matching configured level or the first level.
     */
    getLevelByNumber(levelNumber) {
        return LEVELS[this.getValidLevelNumber(levelNumber)];
    }

    /**
     * @param {number|string} levelNumber - Requested level identifier.
     * @returns {number} Configured integer level or the safe first level.
     */
    getValidLevelNumber(levelNumber) {
        const numericLevel = Number(levelNumber);
        return Number.isInteger(numericLevel) && LEVELS[numericLevel] ?
            numericLevel : 1;
    }

    /** @returns {Character} New player character. */
    createPlayer() {
        return new Character();
    }

    /** @returns {Object} Initial ownership state for all shop upgrades. */
    createDefaultUpgrades() {
        return {
            speedBoost: false,
            extraHealth: false,
            poisonCapacity: false
        };
    }

    /** @param {number|string} levelNumber - Number of the level to start. */
    start(levelNumber) {
        this.resetSession();
        this.startLevel(levelNumber);
    }

    /** @param {number|string} levelNumber - Number of the next level. */
    startNextLevel(levelNumber) {
        this.startLevel(levelNumber);
    }

    /** Restarts the currently selected level. */
    restartCurrentLevel() {
        this.startLevel(this.currentLevel);
    }

    /** @param {number|string} levelNumber - Requested level identifier. */
    startLevel(levelNumber) {
        this.currentLevel = this.getValidLevelNumber(levelNumber);
        this.activeLevel = this.getLevelByNumber(this.currentLevel);
        this.status = 'playing';
        this.isRunning = true;
        this.isPaused = false;
        this.resetPlayer();
        this.resetLevel();
    }

    /** Clears collectible inventory and purchased upgrades. */
    resetSession() {
        this.initializeSessionState();
    }

    /** Pauses an active game session. */
    pause() {
        if (this.isRunning) {
            this.isPaused = true;
            this.status = 'paused';
        }
    }

    /** Resumes an active game session. */
    resume() {
        if (this.isRunning) {
            this.isPaused = false;
            this.status = 'playing';
        }
    }

    /** Stops the current session and returns its state to the menu. */
    stop() {
        this.status = 'menu';
        this.isRunning = false;
        this.isPaused = false;
    }

    /** Completes the current level and selects its next interface state. */
    completeLevel() {
        this.status = this.getCompletionStatus();
        this.isRunning = false;
        this.isPaused = false;
    }

    /** @returns {string} Shop or final level-completion status. */
    getCompletionStatus() {
        if (this.currentLevel === 1) {
            return 'shop';
        }
        return 'levelComplete';
    }

    /** Marks the current session as defeated. */
    setGameOver() {
        this.status = 'gameOver';
        this.isRunning = false;
        this.isPaused = false;
    }

    /** Creates a new player and reapplies persistent upgrades. */
    resetPlayer() {
        this.player = this.createPlayer();
        this.applyUpgradesToPlayer();
    }

    /** Applies all purchased character upgrades. */
    applyUpgradesToPlayer() {
        this.applySpeedUpgrade();
        this.applyHealthUpgrade();
    }

    /** Applies the speed upgrade when it is owned. */
    applySpeedUpgrade() {
        if (this.upgrades.speedBoost) {
            this.player.increaseSpeed(GAME_CONFIG.upgradeSpeedBonus);
        }
    }

    /** Applies the extra-health upgrade when it is owned. */
    applyHealthUpgrade() {
        if (this.upgrades.extraHealth) {
            this.player.setMaxHealth(this.getUpgradedHealth());
        }
    }

    /** @returns {number} Maximum health including the shop bonus. */
    getUpgradedHealth() {
        return GAME_CONFIG.playerHealth + GAME_CONFIG.upgradeHealthBonus;
    }

    /** Restores all mutable objects in the active level. */
    resetLevel() {
        this.activeLevel.reset();
    }

    /** @param {number} value - Coin value to add to the inventory. */
    collectCoin(value) {
        this.coins += value;
    }

    /**
     * @param {number} value - Bottle value to add to the inventory.
     * @returns {boolean} Whether the inventory was increased.
     */
    collectPoisonBottle(value) {
        if (!this.canCollectPoisonBottle(value)) {
            return false;
        }
        const nextValue = this.poisonBottles + value;
        this.poisonBottles = Math.min(nextValue, this.getMaxPoisonBottles());
        return true;
    }

    /**
     * @param {number} [value=1] - Bottle value offered to the inventory.
     * @returns {boolean} Whether a bottle would increase the inventory.
     */
    canCollectPoisonBottle(value = 1) {
        return value > 0 &&
            this.poisonBottles < this.getMaxPoisonBottles();
    }

    /** @returns {boolean} Whether one poison bottle was consumed. */
    usePoisonBottle() {
        if (this.poisonBottles <= 0) {
            return false;
        }
        this.poisonBottles -= 1;
        return true;
    }

    /** @returns {number} Current poison bottle capacity. */
    getMaxPoisonBottles() {
        if (this.upgrades.poisonCapacity) {
            return GAME_CONFIG.playerMaxPoisonBottles +
                GAME_CONFIG.upgradePoisonCapacityBonus;
        }
        return GAME_CONFIG.playerMaxPoisonBottles;
    }

    /**
     * @param {string} upgradeName - Name of the requested shop upgrade.
     * @returns {boolean} Whether the upgrade was purchased.
     */
    purchaseUpgrade(upgradeName) {
        if (!this.canPurchaseUpgrade(upgradeName)) {
            return false;
        }
        this.coins -= this.getUpgradeCost(upgradeName);
        this.upgrades[upgradeName] = true;
        this.applyUpgradesToPlayer();
        return true;
    }

    /**
     * @param {string} upgradeName - Name of the requested shop upgrade.
     * @returns {boolean} Whether the configured upgrade can be purchased.
     */
    canPurchaseUpgrade(upgradeName) {
        return this.hasUpgradeConfig(upgradeName) &&
            !this.upgrades[upgradeName] &&
            this.coins >= this.getUpgradeCost(upgradeName);
    }

    /**
     * @param {string} upgradeName - Name of the requested shop upgrade.
     * @returns {boolean} Whether an upgrade configuration exists.
     */
    hasUpgradeConfig(upgradeName) {
        return Boolean(GAME_CONFIG.shopUpgrades[upgradeName]);
    }

    /**
     * @param {string} upgradeName - Name of a configured shop upgrade.
     * @returns {number} Configured coin cost.
     */
    getUpgradeCost(upgradeName) {
        return GAME_CONFIG.shopUpgrades[upgradeName].cost;
    }

    /**
     * @param {string} upgradeName - Name of the requested shop upgrade.
     * @returns {boolean} Whether the upgrade is already owned.
     */
    isUpgradeOwned(upgradeName) {
        return Boolean(this.upgrades[upgradeName]);
    }

    /** @param {number} framesPerSecond - Current rendered frame rate. */
    setFramesPerSecond(framesPerSecond) {
        this.framesPerSecond = framesPerSecond;
    }
}