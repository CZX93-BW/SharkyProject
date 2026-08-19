'use strict';

class CanvasStatusBar extends DrawableObject {
    constructor(x, y, width, height, imagePaths) {
        super(x, y, width, height);
        this.images = imagePaths.map((path) => this.getCachedImage(path));
        this.percentage = 100;
        this.setPercentage(100);
    }

    setValue(value, maximum) {
        const safeMaximum = Math.max(1, maximum);
        this.setPercentage(value / safeMaximum * 100);
    }

    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.image = this.images[this.getImageIndex()];
    }

    getImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.statusBars = this.createStatusBars();
    }

    createStatusBars() {
        const assets = ASSET_CONFIG.ui.statusBars;

        return {
            health: new CanvasStatusBar(15, 10, 190, 50, assets.health),
            coins: new CanvasStatusBar(15, 60, 190, 50, assets.coins),
            poison: new CanvasStatusBar(15, 110, 190, 50, assets.poison),
            bossHealth: new CanvasStatusBar(
                this.canvas.width - 205,
                10,
                190,
                50,
                assets.bossHealth
            )
        };
    }

    render(gameState, camera, attackManager) {
        this.clearCanvas();
        this.drawLevelBackground(gameState, camera);
        this.drawWorld(gameState, camera, attackManager);
        this.drawStatusBars(gameState);
        this.drawDebugLayer(gameState, camera, attackManager);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLevelBackground(gameState, camera) {
        const backgroundObjects = gameState.activeLevel.backgroundObjects;
        backgroundObjects.forEach((object) => object.draw(this.context, camera));
    }

    drawWorld(gameState, camera, attackManager) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);
        this.drawFinishObject(gameState.activeLevel.finishObject);
        this.drawBarriers(gameState.activeLevel.barrierObjects);
        this.drawCollectibles(gameState.activeLevel.getActiveCollectibles());
        this.drawEnemies(gameState.activeLevel.enemies);
        this.drawEndboss(gameState.activeLevel.endboss);
        this.drawAttacks(attackManager.getActiveAttacks());
        this.drawPlayer(gameState.player);
        this.context.restore();
    }

    drawFinishObject(finishObject) {
        if (finishObject) {
            finishObject.draw(this.context);
        }
    }

    drawBarriers(barriers) {
        barriers.forEach((barrier) => barrier.draw(this.context));
    }

    drawCollectibles(collectibles) {
        collectibles.forEach((collectible) => collectible.draw(this.context));
    }

    drawEnemies(enemies) {
        enemies.forEach((enemy) => enemy.draw(this.context));
    }

    drawEndboss(endboss) {
        if (endboss) {
            endboss.draw(this.context);
        }
    }

    drawAttacks(attacks) {
        attacks.forEach((attack) => attack.draw(this.context));
    }

    drawPlayer(player) {
        player.draw(this.context);
    }

    drawStatusBars(gameState) {
        this.updateStatusBars(gameState);
        this.drawPlayerStatusBars();
        this.drawBossStatusBar(gameState.activeLevel.endboss);
    }

    updateStatusBars(gameState) {
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
        this.updateBossStatusBar(gameState.activeLevel.endboss);
    }

    getLevelCoinMaximum(level) {
        const coins = level.collectibles.filter((collectible) => {
            return collectible.type === 'coin';
        });

        return Math.max(1, coins.length);
    }

    updateBossStatusBar(endboss) {
        if (!endboss) {
            return;
        }

        this.statusBars.bossHealth.setValue(
            endboss.health,
            endboss.maxHealth
        );
    }

    drawPlayerStatusBars() {
        this.statusBars.health.draw(this.context);
        this.statusBars.coins.draw(this.context);
        this.statusBars.poison.draw(this.context);
    }

    drawBossStatusBar(endboss) {
        if (!endboss || !endboss.hasBeenIntroduced || endboss.isDefeated) {
            return;
        }

        this.statusBars.bossHealth.draw(this.context);
    }

    drawDebugLayer(gameState, camera, attackManager) {
        if (!gameState.debugMode) {
            return;
        }

        this.drawDebugWorldLayer(gameState, camera, attackManager);
        this.drawDebugInfo(gameState, camera, attackManager);
    }

    drawDebugWorldLayer(gameState, camera, attackManager) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);
        this.drawDebugHitbox(gameState.player);
        this.drawDebugEnemies(gameState.activeLevel.enemies);
        this.drawDebugEndboss(gameState.activeLevel.endboss);
        this.drawDebugAttacks(attackManager.getActiveAttacks());
        this.drawDebugFinishObject(gameState.activeLevel.finishObject);
        this.drawDebugCollectibles(gameState.activeLevel.getActiveCollectibles());
        this.drawDebugSolidAreas(gameState.activeLevel);
        this.context.restore();
    }

    drawDebugEnemies(enemies) {
        enemies.forEach((enemy) => this.drawDebugHitbox(enemy));
    }

    drawDebugEndboss(endboss) {
        if (endboss && !endboss.isDefeated) {
            this.drawDebugHitbox(endboss);
        }
    }

    drawDebugAttacks(attacks) {
        attacks.forEach((attack) => this.drawDebugArea(attack));
    }

    drawDebugFinishObject(finishObject) {
        if (finishObject) {
            this.drawDebugArea(finishObject);
        }
    }

    drawDebugCollectibles(collectibles) {
        collectibles.forEach((collectible) => this.drawDebugArea(collectible));
    }

    drawDebugSolidAreas(level) {
        level.solidAreas.forEach((solidArea) => this.drawDebugArea(solidArea));
    }

    drawDebugArea(area) {
        this.context.strokeStyle = '#ffee88';
        this.context.lineWidth = 2;
        this.context.strokeRect(area.x, area.y, area.width, area.height);
    }

    drawDebugHitbox(object) {
        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth = 2;
        this.context.strokeRect(object.x, object.y, object.width, object.height);
    }

    drawDebugInfo(gameState, camera, attackManager) {
        const lines = this.getDebugLines(gameState, camera, attackManager);
        this.drawDebugLines(lines);
    }

    getDebugLines(gameState, camera, attackManager) {
        return [
            `FPS: ${gameState.framesPerSecond}`,
            `status: ${gameState.status}`,
            `health: ${gameState.player.health}`,
            `poison: ${gameState.poisonBottles}`,
            `coins: ${gameState.coins}`,
            `attacks: ${attackManager.getActiveAttacks().length}`,
            `x: ${Math.round(gameState.player.x)}`,
            `y: ${Math.round(gameState.player.y)}`,
            `cameraX: ${Math.round(camera.x)}`,
            `cameraY: ${Math.round(camera.y)}`,
            `enemies: ${this.getEnemyDebugValue(gameState.activeLevel)}`,
            `endboss: ${this.getEndbossDebugValue(gameState.activeLevel.endboss)}`
        ];
    }

    /** Returns current dynamic enemy counters for the debug overlay. */
    getEnemyDebugValue(level) {
        const stats = level.getEnemySpawnerStats();

        if (!stats) {
            return `${level.enemies.length}`;
        }

        return `${stats.active}/${stats.maximumActive} (${stats.spawned}/${stats.totalBudget})`;
    }

    getEndbossDebugValue(endboss) {
        if (!endboss) {
            return 'none';
        }

        return `${endboss.health}/${endboss.maxHealth}`;
    }

    drawDebugLines(lines) {
        this.context.fillStyle = '#ffffff';
        this.context.font = '16px Arial';

        lines.forEach((line, index) => this.drawDebugLine(line, index));
    }

    drawDebugLine(line, index) {
        const x = GAME_CONFIG.debugTextX;
        const y = GAME_CONFIG.debugTextY + index * GAME_CONFIG.debugTextGap;

        this.context.fillText(line, x, y);
    }
}