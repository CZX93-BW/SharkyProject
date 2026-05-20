'use strict';

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    render(gameState, camera) {
        this.clearCanvas();
        this.drawLevelBackground(gameState, camera);
        this.drawWorld(gameState, camera);
        this.drawDebugLayer(gameState, camera);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLevelBackground(gameState, camera) {
        const backgroundObjects = gameState.activeLevel.backgroundObjects;
        backgroundObjects.forEach((object) => object.draw(this.context, camera));
        this.drawLightRays();
    }

    drawLightRays() {
        this.context.fillStyle = 'rgba(255, 255, 255, 0.08)';
        this.drawLightRay(90, 0, 120, 540);
        this.drawLightRay(420, 0, 80, 540);
        this.drawLightRay(720, 0, 130, 540);
    }

    drawLightRay(x, y, width, height) {
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x + width, y);
        this.context.lineTo(x + width / 2, height);
        this.context.closePath();
        this.context.fill();
    }

    drawWorld(gameState, camera) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);
        this.drawFinishObject(gameState.activeLevel.finishObject);
        this.drawCollectibles(gameState.activeLevel.getActiveCollectibles());
        this.drawEnemies(gameState.activeLevel.enemies);
        this.drawEndboss(gameState.activeLevel.endboss);
        this.drawPlayer(gameState.player);
        this.context.restore();
    }

    drawFinishObject(finishObject) {
        if (finishObject) {
            finishObject.draw(this.context);
        }
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

    drawPlayer(player) {
        player.draw(this.context);
    }

    drawDebugLayer(gameState, camera) {
        if (!gameState.debugMode) {
            return;
        }

        this.drawDebugWorldLayer(gameState, camera);
        this.drawDebugInfo(gameState, camera);
    }

    drawDebugWorldLayer(gameState, camera) {
        this.context.save();
        this.context.translate(-camera.x, -camera.y);
        this.drawDebugHitbox(gameState.player);
        this.drawDebugEnemies(gameState.activeLevel.enemies);
        this.drawDebugEndboss(gameState.activeLevel.endboss);
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

    drawDebugInfo(gameState, camera) {
        const lines = this.getDebugLines(gameState, camera);
        this.drawDebugLines(lines);
    }

    getDebugLines(gameState, camera) {
        return [
            `FPS: ${gameState.framesPerSecond}`,
            `status: ${gameState.status}`,
            `health: ${gameState.player.health}`,
            `poison: ${gameState.poisonBottles}`,
            `coins: ${gameState.coins}`,
            `x: ${Math.round(gameState.player.x)}`,
            `y: ${Math.round(gameState.player.y)}`,
            `cameraX: ${Math.round(camera.x)}`,
            `cameraY: ${Math.round(camera.y)}`,
            `collectibles: ${gameState.activeLevel.getActiveCollectibles().length}`,
            `endboss: ${this.getEndbossDebugValue(gameState.activeLevel.endboss)}`
        ];
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