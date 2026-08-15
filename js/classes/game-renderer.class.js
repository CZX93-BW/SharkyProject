'use strict';

class CanvasStatusBar extends DrawableObject {
    /** Creates a canvas status bar with six percentage images. */
    constructor(x, y, width, height, imagePaths) {
        super(x, y, width, height);
        this.images = imagePaths.map((path) => {
            return this.getCachedImage(path);
        });
        this.percentage = 100;
        this.setPercentage(100);
    }

    /** Converts a current and maximum value into a percentage. */
    setValue(value, maximum) {
        const safeMaximum = Math.max(1, maximum);
        this.setPercentage(value / safeMaximum * 100);
    }

    /** Selects the matching status bar image. */
    setPercentage(percentage) {
        this.percentage = Math.max(
            0,
            Math.min(100, percentage)
        );
        this.image = this.images[this.getImageIndex()];
    }

    /** Returns the image index for 0 to 100 percent. */
    getImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}

class GameRenderer {
    /** Creates the renderer and its fixed canvas status bars. */
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.statusBars = this.createStatusBars();
    }

    /** Creates all player and boss status bars. */
    createStatusBars() {
        const assets = ASSET_CONFIG.ui.statusBars;

        return {
            health: new CanvasStatusBar(
                15,
                10,
                190,
                50,
                assets.health
            ),
            coins: new CanvasStatusBar(
                15,
                60,
                190,
                50,
                assets.coins
            ),
            poison: new CanvasStatusBar(
                15,
                110,
                190,
                50,
                assets.poison
            ),
            bossHealth: new CanvasStatusBar(
                this.canvas.width - 205,
                10,
                190,
                50,
                assets.bossHealth
            )
        };
    }

    /** Renders one complete game frame. */
    render(gameState, camera, attackManager) {
        this.clearCanvas();
        this.drawLevelBackground(gameState, camera);
        this.drawWorld(gameState, camera, attackManager);
        this.drawStatusBars(gameState);
        this.drawDebugLayer(gameState, camera, attackManager);
    }

    /** Clears the previous canvas frame. */
    clearCanvas() {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    /** Draws all parallax background layers. */
    drawLevelBackground(gameState, camera) {
        const backgroundObjects =
            gameState.activeLevel.backgroundObjects;

        backgroundObjects.forEach((object) => {
            object.draw(this.context, camera);
        });
    }

    /** Draws every camera-dependent world object. */
    drawWorld(gameState, camera, attackManager) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);

        this.drawFinishObject(
            gameState.activeLevel.finishObject
        );
        this.drawCollectibles(
            gameState.activeLevel.getActiveCollectibles()
        );
        this.drawEnemies(
            gameState.activeLevel.enemies
        );
        this.drawEndboss(
            gameState.activeLevel.endboss
        );
        this.drawAttacks(
            attackManager.getActiveAttacks()
        );
        this.drawPlayer(gameState.player);

        this.context.restore();
    }

    /** Draws the level finish object if available. */
    drawFinishObject(finishObject) {
        if (finishObject) {
            finishObject.draw(this.context);
        }
    }

    /** Draws all active collectible objects. */
    drawCollectibles(collectibles) {
        collectibles.forEach((collectible) => {
            collectible.draw(this.context);
        });
    }

    /** Draws all regular enemies. */
    drawEnemies(enemies) {
        enemies.forEach((enemy) => {
            enemy.draw(this.context);
        });
    }

    /** Draws the current level boss. */
    drawEndboss(endboss) {
        if (endboss) {
            endboss.draw(this.context);
        }
    }

    /** Draws all active player attacks. */
    drawAttacks(attacks) {
        attacks.forEach((attack) => {
            attack.draw(this.context);
        });
    }

    /** Draws the player character. */
    drawPlayer(player) {
        player.draw(this.context);
    }

    /** Updates and draws the fixed HUD status bars. */
    drawStatusBars(gameState) {
        this.updateStatusBars(gameState);
        this.drawPlayerStatusBars();
        this.drawBossStatusBar(
            gameState.activeLevel.endboss
        );
    }

    /** Updates every status bar using current game values. */
    updateStatusBars(gameState) {
        this.statusBars.health.setValue(
            gameState.player.health,
            gameState.player.maxHealth
        );

        this.statusBars.coins.setValue(
            gameState.coins,
            this.getLevelCoinMaximum(
                gameState.activeLevel
            )
        );

        this.statusBars.poison.setValue(
            gameState.poisonBottles,
            gameState.getMaxPoisonBottles()
        );

        this.updateBossStatusBar(
            gameState.activeLevel.endboss
        );
    }

    /** Returns the number of coins available in the level. */
    getLevelCoinMaximum(level) {
        const coins = level.collectibles.filter(
            (collectible) => {
                return collectible.type === 'coin';
            }
        );

        return Math.max(1, coins.length);
    }

    /** Updates the boss health image if a boss exists. */
    updateBossStatusBar(endboss) {
        if (!endboss) {
            return;
        }

        this.statusBars.bossHealth.setValue(
            endboss.health,
            endboss.maxHealth
        );
    }

    /** Draws health, coin and poison status bars. */
    drawPlayerStatusBars() {
        this.statusBars.health.draw(this.context);
        this.statusBars.coins.draw(this.context);
        this.statusBars.poison.draw(this.context);
    }

    /** Draws boss health after the boss introduction begins. */
    drawBossStatusBar(endboss) {
        if (
            !endboss ||
            !endboss.hasBeenIntroduced ||
            endboss.isDefeated
        ) {
            return;
        }

        this.statusBars.bossHealth.draw(this.context);
    }

    /** Draws debug information when debug mode is enabled. */
    drawDebugLayer(gameState, camera, attackManager) {
        if (!gameState.debugMode) {
            return;
        }

        this.drawDebugWorldLayer(
            gameState,
            camera,
            attackManager
        );
        this.drawDebugInfo(
            gameState,
            camera,
            attackManager
        );
    }

    /** Draws camera-dependent debug outlines. */
    drawDebugWorldLayer(
        gameState,
        camera,
        attackManager
    ) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);

        this.drawDebugHitbox(gameState.player);
        this.drawDebugEnemies(
            gameState.activeLevel.enemies
        );
        this.drawDebugEndboss(
            gameState.activeLevel.endboss
        );
        this.drawDebugAttacks(
            attackManager.getActiveAttacks()
        );
        this.drawDebugFinishObject(
            gameState.activeLevel.finishObject
        );
        this.drawDebugCollectibles(
            gameState.activeLevel.getActiveCollectibles()
        );
        this.drawDebugSolidAreas(
            gameState.activeLevel
        );

        this.context.restore();
    }

    /** Draws hitboxes for all enemies. */
    drawDebugEnemies(enemies) {
        enemies.forEach((enemy) => {
            this.drawDebugHitbox(enemy);
        });
    }

    /** Draws the boss hitbox while the boss is active. */
    drawDebugEndboss(endboss) {
        if (endboss && !endboss.isDefeated) {
            this.drawDebugHitbox(endboss);
        }
    }

    /** Draws outlines for active attacks. */
    drawDebugAttacks(attacks) {
        attacks.forEach((attack) => {
            this.drawDebugArea(attack);
        });
    }

    /** Draws the finish object outline. */
    drawDebugFinishObject(finishObject) {
        if (finishObject) {
            this.drawDebugArea(finishObject);
        }
    }

    /** Draws outlines for active collectibles. */
    drawDebugCollectibles(collectibles) {
        collectibles.forEach((collectible) => {
            this.drawDebugArea(collectible);
        });
    }

    /** Draws all solid level areas. */
    drawDebugSolidAreas(level) {
        level.solidAreas.forEach((solidArea) => {
            this.drawDebugArea(solidArea);
        });
    }

    /** Draws a generic rectangular debug outline. */
    drawDebugArea(area) {
        this.context.strokeStyle = '#ffee88';
        this.context.lineWidth = 2;
        this.context.strokeRect(
            area.x,
            area.y,
            area.width,
            area.height
        );
    }

    /** Draws an object hitbox. */
    drawDebugHitbox(object) {
        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth = 2;
        this.context.strokeRect(
            object.x,
            object.y,
            object.width,
            object.height
        );
    }

    /** Creates and draws the debug text information. */
    drawDebugInfo(gameState, camera, attackManager) {
        const lines = this.getDebugLines(
            gameState,
            camera,
            attackManager
        );

        this.drawDebugLines(lines);
    }

    /** Returns the current debug information lines. */
    getDebugLines(gameState, camera, attackManager) {
        return [
            `FPS: ${gameState.framesPerSecond}`,
            `status: ${gameState.status}`,
            `health: ${gameState.player.health}`,
            `poison: ${gameState.poisonBottles}`,
            `coins: ${gameState.coins}`,
            `attacks: ${
                attackManager.getActiveAttacks().length
            }`,
            `x: ${Math.round(gameState.player.x)}`,
            `y: ${Math.round(gameState.player.y)}`,
            `cameraX: ${Math.round(camera.x)}`,
            `cameraY: ${Math.round(camera.y)}`,
            `endboss: ${
                this.getEndbossDebugValue(
                    gameState.activeLevel.endboss
                )
            }`
        ];
    }

    /** Returns the readable boss health debug value. */
    getEndbossDebugValue(endboss) {
        if (!endboss) {
            return 'none';
        }

        return `${endboss.health}/${endboss.maxHealth}`;
    }

    /** Draws all debug text lines. */
    drawDebugLines(lines) {
        this.context.fillStyle = '#ffffff';
        this.context.font = '16px Arial';

        lines.forEach((line, index) => {
            this.drawDebugLine(line, index);
        });
    }

    /** Draws one debug text line. */
    drawDebugLine(line, index) {
        const x = GAME_CONFIG.debugTextX;
        const y = GAME_CONFIG.debugTextY +
            index * GAME_CONFIG.debugTextGap;

        this.context.fillText(line, x, y);
    }
}