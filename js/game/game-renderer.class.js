'use strict';

/** Represents an image-based canvas status bar with percentage states. */
class CanvasStatusBar extends DrawableObject {
    /**
     * Creates a status bar and selects its full-value image.
     *
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
     * Converts a current and maximum value into a percentage.
     *
     * @param {number} value - Current status value.
     * @param {number} maximum - Maximum status value.
     */
    setValue(value, maximum) {
        const safeMaximum = Math.max(1, maximum);
        this.setPercentage(value / safeMaximum * 100);
    }

    /** @param {number} percentage - Status value between zero and one hundred. */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.image = this.images[this.getImageIndex()];
    }

    /** @returns {number} Image index matching the current percentage. */
    getImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}

/** Renders the level, interface, attacks, and optional debug information. */
class GameRenderer {
    /** @param {HTMLCanvasElement} canvas - Canvas used for all game rendering. */
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.statusBars = this.createStatusBars();
    }

    /** @returns {Object} Status bars used by the game interface. */
    createStatusBars() {
        const assets = ASSET_CONFIG.ui.statusBars;
        return {
            ...this.createPlayerStatusBars(assets),
            bossHealth: this.createBossStatusBar(assets.bossHealth)
        };
    }

    /**
     * @param {Object} assets - Player status bar asset collections.
     * @returns {Object} Player health, coin, and poison status bars.
     */
    createPlayerStatusBars(assets) {
        return {
            health: new CanvasStatusBar(15, 10, 190, 50, assets.health),
            coins: new CanvasStatusBar(15, 60, 190, 50, assets.coins),
            poison: new CanvasStatusBar(15, 110, 190, 50, assets.poison)
        };
    }

    /**
     * @param {string[]} imagePaths - Boss status bar image paths.
     * @returns {CanvasStatusBar} Boss health status bar.
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

    /**
     * Renders one complete game frame.
     *
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     * @param {AttackManager} attackManager - Active attack controller.
     */
    render(gameState, camera, attackManager) {
        this.clearCanvas();
        this.drawLevelBackground(gameState, camera);
        this.drawWorld(gameState, camera, attackManager);
        this.drawStatusBars(gameState);
        this.drawDebugLayer(gameState, camera, attackManager);
    }

    /** Clears the complete visible canvas. */
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     */
    drawLevelBackground(gameState, camera) {
        const backgroundObjects = gameState.activeLevel.backgroundObjects;
        backgroundObjects.forEach((object) => object.draw(this.context, camera));
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     * @param {AttackManager} attackManager - Active attack controller.
     */
    drawWorld(gameState, camera, attackManager) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);
        this.drawLevelObjects(gameState.activeLevel);
        this.drawAttacks(attackManager.getActiveAttacks());
        this.drawPlayer(gameState.player);
        this.context.restore();
    }

    /** @param {Level} level - Active level containing drawable world objects. */
    drawLevelObjects(level) {
        this.drawFinishObject(level.finishObject);
        this.drawBarriers(level.barrierObjects);
        this.drawCollectibles(level.getActiveCollectibles());
        this.drawEnemies(level.enemies);
        this.drawEndboss(level.endboss);
    }

    /** @param {FinishObject|null} finishObject - Current level exit. */
    drawFinishObject(finishObject) {
        if (finishObject) {
            finishObject.draw(this.context);
        }
    }

    /** @param {BarrierObject[]} barriers - Visible level barriers. */
    drawBarriers(barriers) {
        barriers.forEach((barrier) => barrier.draw(this.context));
    }

    /** @param {CollectibleObject[]} collectibles - Active collectibles. */
    drawCollectibles(collectibles) {
        collectibles.forEach((collectible) => collectible.draw(this.context));
    }

    /** @param {Enemy[]} enemies - Current standard enemies. */
    drawEnemies(enemies) {
        enemies.forEach((enemy) => enemy.draw(this.context));
    }

    /** @param {Endboss|null} endboss - Current level boss. */
    drawEndboss(endboss) {
        if (endboss) {
            endboss.draw(this.context);
        }
    }

    /** @param {AttackObject[]} attacks - Active player attacks. */
    drawAttacks(attacks) {
        attacks.forEach((attack) => attack.draw(this.context));
    }

    /** @param {Character} player - Current player character. */
    drawPlayer(player) {
        player.draw(this.context);
    }

    /** @param {GameState} gameState - Current game state. */
    drawStatusBars(gameState) {
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
     * @returns {number} Number of collectible coins or a safe value of one.
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

    /**
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     * @param {AttackManager} attackManager - Active attack controller.
     */
    drawDebugLayer(gameState, camera, attackManager) {
        if (!gameState.debugMode) {
            return;
        }
        this.drawDebugWorldLayer(gameState, camera, attackManager);
        this.drawDebugInfo(gameState, camera, attackManager);
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     * @param {AttackManager} attackManager - Active attack controller.
     */
    drawDebugWorldLayer(gameState, camera, attackManager) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);
        this.drawDebugActors(gameState, attackManager);
        this.drawDebugLevelObjects(gameState.activeLevel);
        this.context.restore();
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {AttackManager} attackManager - Active attack controller.
     */
    drawDebugActors(gameState, attackManager) {
        this.drawDebugHitbox(gameState.player);
        this.drawDebugEnemies(gameState.activeLevel.enemies);
        this.drawDebugEndboss(gameState.activeLevel.endboss);
        this.drawDebugAttacks(attackManager.getActiveAttacks());
    }

    /** @param {Level} level - Active level containing debug objects. */
    drawDebugLevelObjects(level) {
        this.drawDebugFinishObject(level.finishObject);
        this.drawDebugCollectibles(level.getActiveCollectibles());
        this.drawDebugSolidAreas(level);
    }

    /** @param {Enemy[]} enemies - Current standard enemies. */
    drawDebugEnemies(enemies) {
        enemies.forEach((enemy) => this.drawDebugHitbox(enemy));
    }

    /** @param {Endboss|null} endboss - Current level boss. */
    drawDebugEndboss(endboss) {
        if (endboss && !endboss.isDefeated) {
            this.drawDebugHitbox(endboss);
        }
    }

    /** @param {AttackObject[]} attacks - Active attacks. */
    drawDebugAttacks(attacks) {
        attacks.forEach((attack) => this.drawDebugArea(attack));
    }

    /** @param {FinishObject|null} finishObject - Current level exit. */
    drawDebugFinishObject(finishObject) {
        if (finishObject) {
            this.drawDebugArea(finishObject);
        }
    }

    /** @param {CollectibleObject[]} collectibles - Active collectibles. */
    drawDebugCollectibles(collectibles) {
        collectibles.forEach((collectible) => this.drawDebugArea(collectible));
    }

    /** @param {Level} level - Active level. */
    drawDebugSolidAreas(level) {
        level.solidAreas.forEach((solidArea) => this.drawDebugArea(solidArea));
    }

    /** @param {Object} area - Rectangular area to outline. */
    drawDebugArea(area) {
        this.context.strokeStyle = '#ffee88';
        this.context.lineWidth = 2;
        this.context.strokeRect(area.x, area.y, area.width, area.height);
    }

    /** @param {DrawableObject} object - Drawable hitbox to outline. */
    drawDebugHitbox(object) {
        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth = 2;
        this.context.strokeRect(object.x, object.y, object.width, object.height);
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     * @param {AttackManager} attackManager - Active attack controller.
     */
    drawDebugInfo(gameState, camera, attackManager) {
        const lines = this.getDebugLines(gameState, camera, attackManager);
        this.drawDebugLines(lines);
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     * @param {AttackManager} attackManager - Active attack controller.
     * @returns {string[]} Current values shown in the debug overlay.
     */
    getDebugLines(gameState, camera, attackManager) {
        return [
            ...this.getPlayerDebugLines(gameState),
            ...this.getWorldDebugLines(gameState, camera, attackManager)
        ];
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @returns {string[]} Current player and session debug values.
     */
    getPlayerDebugLines(gameState) {
        return [
            `FPS: ${gameState.framesPerSecond}`,
            `status: ${gameState.status}`,
            `health: ${gameState.player.health}`,
            `poison: ${gameState.poisonBottles}`,
            `coins: ${gameState.coins}`
        ];
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {Camera} camera - Active world camera.
     * @param {AttackManager} attackManager - Active attack controller.
     * @returns {string[]} Current world and combat debug values.
     */
    getWorldDebugLines(gameState, camera, attackManager) {
        const level = gameState.activeLevel;
        return [
            `attacks: ${attackManager.getActiveAttacks().length}`,
            `x: ${Math.round(gameState.player.x)}`,
            `y: ${Math.round(gameState.player.y)}`,
            `cameraX: ${Math.round(camera.x)}`,
            `cameraY: ${Math.round(camera.y)}`,
            `enemies: ${this.getEnemyDebugValue(level)}`,
            `endboss: ${this.getEndbossDebugValue(level.endboss)}`
        ];
    }

    /**
     * @param {Level} level - Active level.
     * @returns {string} Current dynamic enemy counters.
     */
    getEnemyDebugValue(level) {
        const stats = level.getEnemySpawnerStats();
        if (!stats) {
            return `${level.enemies.length}`;
        }
        return `${stats.active}/${stats.maximumActive} ` +
            `(${stats.spawned}/${stats.totalBudget})`;
    }

    /**
     * @param {Endboss|null} endboss - Current level boss.
     * @returns {string} Current boss health or an absence marker.
     */
    getEndbossDebugValue(endboss) {
        if (!endboss) {
            return 'none';
        }
        return `${endboss.health}/${endboss.maxHealth}`;
    }

    /** @param {string[]} lines - Debug text lines to draw. */
    drawDebugLines(lines) {
        this.context.fillStyle = '#ffffff';
        this.context.font = '16px Arial';
        lines.forEach((line, index) => this.drawDebugLine(line, index));
    }

    /**
     * @param {string} line - Debug text content.
     * @param {number} index - Vertical line index.
     */
    drawDebugLine(line, index) {
        const x = GAME_CONFIG.debugTextX;
        const y = GAME_CONFIG.debugTextY + index * GAME_CONFIG.debugTextGap;
        this.context.fillText(line, x, y);
    }
}