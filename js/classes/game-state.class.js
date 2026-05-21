'use strict';

class GameState {
    constructor() {
        this.status = 'menu';
        this.isRunning = false;
        this.isPaused = false;
        this.currentLevel = 1;
        this.activeLevel = this.getLevelByNumber(1);
        this.coins = 0;
        this.poisonBottles = 0;
        this.upgrades = this.createDefaultUpgrades();
        this.framesPerSecond = 0;
        this.debugMode = this.getDebugMode();
        this.player = this.createPlayer();
    }

    getDebugMode() {
        const searchParameters = new URLSearchParams(window.location.search);
        return searchParameters.get(GAME_CONFIG.debugParameter) === 'true';
    }

    getLevelByNumber(levelNumber) {
        return LEVELS[levelNumber] || LEVELS[1];
    }

    createPlayer() {
        return new Character();
    }

    createDefaultUpgrades() {
        return {
            speedBoost: false,
            extraHealth: false,
            poisonCapacity: false
        };
    }

    start(levelNumber) {
        this.resetSession();
        this.startLevel(levelNumber);
    }

    startNextLevel(levelNumber) {
        this.startLevel(levelNumber);
    }

    restartCurrentLevel() {
        this.startLevel(this.currentLevel);
    }

    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.activeLevel = this.getLevelByNumber(levelNumber);
        this.status = 'playing';
        this.isRunning = true;
        this.isPaused = false;
        this.resetPlayer();
        this.resetLevel();
    }

    resetSession() {
        this.coins = 0;
        this.poisonBottles = 0;
        this.upgrades = this.createDefaultUpgrades();
    }

    pause() {
        if (this.isRunning) {
            this.isPaused = true;
            this.status = 'paused';
        }
    }

    resume() {
        if (this.isRunning) {
            this.isPaused = false;
            this.status = 'playing';
        }
    }

    stop() {
        this.status = 'menu';
        this.isRunning = false;
        this.isPaused = false;
    }

    completeLevel() {
        this.status = this.getCompletionStatus();
        this.isRunning = false;
        this.isPaused = false;
    }

    getCompletionStatus() {
        if (this.currentLevel === 1) {
            return 'shop';
        }

        return 'levelComplete';
    }

    setGameOver() {
        this.status = 'gameOver';
        this.isRunning = false;
        this.isPaused = false;
    }

    resetPlayer() {
        this.player = this.createPlayer();
        this.applyUpgradesToPlayer();
    }

    applyUpgradesToPlayer() {
        this.applySpeedUpgrade();
        this.applyHealthUpgrade();
    }

    applySpeedUpgrade() {
        if (this.upgrades.speedBoost) {
            this.player.increaseSpeed(GAME_CONFIG.upgradeSpeedBonus);
        }
    }

    applyHealthUpgrade() {
        if (this.upgrades.extraHealth) {
            this.player.setMaxHealth(this.getUpgradedHealth());
        }
    }

    getUpgradedHealth() {
        return GAME_CONFIG.playerHealth + GAME_CONFIG.upgradeHealthBonus;
    }

    resetLevel() {
        this.activeLevel.reset();
    }

    collectCoin(value) {
        this.coins += value;
    }

    collectPoisonBottle(value) {
        const nextValue = this.poisonBottles + value;
        this.poisonBottles = Math.min(nextValue, this.getMaxPoisonBottles());
    }

    getMaxPoisonBottles() {
        if (this.upgrades.poisonCapacity) {
            return GAME_CONFIG.playerMaxPoisonBottles + GAME_CONFIG.upgradePoisonCapacityBonus;
        }

        return GAME_CONFIG.playerMaxPoisonBottles;
    }

    purchaseUpgrade(upgradeName) {
        if (!this.canPurchaseUpgrade(upgradeName)) {
            return false;
        }

        this.coins -= this.getUpgradeCost(upgradeName);
        this.upgrades[upgradeName] = true;
        this.applyUpgradesToPlayer();
        return true;
    }

    canPurchaseUpgrade(upgradeName) {
        return this.hasUpgradeConfig(upgradeName) &&
            !this.upgrades[upgradeName] &&
            this.coins >= this.getUpgradeCost(upgradeName);
    }

    hasUpgradeConfig(upgradeName) {
        return Boolean(GAME_CONFIG.shopUpgrades[upgradeName]);
    }

    getUpgradeCost(upgradeName) {
        return GAME_CONFIG.shopUpgrades[upgradeName].cost;
    }

    isUpgradeOwned(upgradeName) {
        return Boolean(this.upgrades[upgradeName]);
    }

    setFramesPerSecond(framesPerSecond) {
        this.framesPerSecond = framesPerSecond;
    }
}