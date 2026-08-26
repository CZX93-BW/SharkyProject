'use strict';

/** Represents an image-based canvas status bar with percentage states. */
class CanvasStatusBar extends DrawableObject {
    /**
     * @param {number} x - Horizontal canvas position.
     * @param {number} y - Vertical canvas position.
     * @param {number} width - Rendered status bar width.
     * @param {number} height - Rendered status bar height.
     * @param {string[]} imagePaths - Images ordered from empty to full.
     */
    constructor(x, y, width, height, imagePaths) {
        super(x, y, width, height);
        this.images = imagePaths.map((path) => this.getCachedImage(path));
        this.percentage = 100;
        this.setPercentage(100);
    }

    /**
     * @param {number} value - Current status value.
     * @param {number} maximum - Maximum status value.
     */
    setValue(value, maximum) {
        const safeMaximum = Math.max(1, maximum);
        this.setPercentage(value / safeMaximum * 100);
    }

    /** @param {number} percentage - Value from zero to one hundred. */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.image = this.images[this.getImageIndex()];
    }

    /** @returns {number} Image index matching the current percentage. */
    getImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}

/** Renders and synchronizes player and boss status bars. */
class GameStatusRenderer {
    /**
     * @param {HTMLCanvasElement} canvas - Game canvas.
     * @param {CanvasRenderingContext2D} context - Rendering context.
     */
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.statusBars = this.createStatusBars();
    }

    /** @returns {Object} All status bars used by the game interface. */
    createStatusBars() {
        const assets = ASSET_CONFIG.ui.statusBars;
        return {
            ...this.createPlayerStatusBars(assets),
            bossHealth: this.createBossStatusBar(assets.bossHealth)
        };
    }

    /**
     * @param {Object} assets - Player status-bar image collections.
     * @returns {Object} Player health, coin, and poison bars.
     */
    createPlayerStatusBars(assets) {
        return {
            health: new CanvasStatusBar(15, 10, 190, 50, assets.health),
            coins: new CanvasStatusBar(15, 60, 190, 50, assets.coins),
            poison: new CanvasStatusBar(15, 110, 190, 50, assets.poison)
        };
    }

    /**
     * @param {string[]} imagePaths - Boss status-bar images.
     * @returns {CanvasStatusBar} Boss health bar.
     */
    createBossStatusBar(imagePaths) {
        return new CanvasStatusBar(
            this.canvas.width - 205,
            10,
            190,
            50,
            imagePaths
        );
    }

    /** @param {GameState} gameState - Current game state. */
    draw(gameState) {
        this.updateStatusBars(gameState);
        this.drawPlayerStatusBars();
        this.drawBossStatusBar(gameState.activeLevel.endboss);
    }

    /** @param {GameState} gameState - Current game state. */
    updateStatusBars(gameState) {
        this.updatePlayerStatusBars(gameState);
        this.updateBossStatusBar(gameState.activeLevel.endboss);
    }

    /** @param {GameState} gameState - Current game state. */
    updatePlayerStatusBars(gameState) {
        this.statusBars.health.setValue(
            gameState.player.health,
            gameState.player.maxHealth
        );
        this.statusBars.coins.setValue(
            gameState.coins,
            this.getLevelCoinMaximum(gameState.activeLevel)
        );
        this.statusBars.poison.setValue(
            gameState.poisonBottles,
            gameState.getMaxPoisonBottles()
        );
    }

    /**
     * @param {Level} level - Active level.
     * @returns {number} Collectible coin count or a safe value of one.
     */
    getLevelCoinMaximum(level) {
        const coins = level.collectibles.filter((collectible) => {
            return collectible.type === 'coin';
        });
        return Math.max(1, coins.length);
    }

    /** @param {Endboss|null} endboss - Current level boss. */
    updateBossStatusBar(endboss) {
        if (!endboss) {
            return;
        }
        this.statusBars.bossHealth.setValue(
            endboss.health,
            endboss.maxHealth
        );
    }

    /** Draws player health, coin, and poison status bars. */
    drawPlayerStatusBars() {
        this.statusBars.health.draw(this.context);
        this.statusBars.coins.draw(this.context);
        this.statusBars.poison.draw(this.context);
    }

    /** @param {Endboss|null} endboss - Current level boss. */
    drawBossStatusBar(endboss) {
        if (!endboss || !endboss.hasBeenIntroduced || endboss.isDefeated) {
            return;
        }
        this.statusBars.bossHealth.draw(this.context);
    }
}