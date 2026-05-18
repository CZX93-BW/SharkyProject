'use strict';

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    render(gameState) {
        this.clearCanvas();
        this.drawBackground();
        this.drawWorld(gameState);
        this.drawDebugLayer(gameState);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        const gradient = this.createOceanGradient();

        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawLightRays();
    }

    createOceanGradient() {
        const gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a87aa');
        gradient.addColorStop(1, '#03263d');
        return gradient;
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

    drawWorld(gameState) {
        gameState.player.draw(this.context);
    }

    drawDebugLayer(gameState) {
        if (!gameState.debugMode) {
            return;
        }

        this.drawDebugHitbox(gameState.player);
        this.drawDebugInfo(gameState);
    }

    drawDebugHitbox(object) {
        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth = 2;
        this.context.strokeRect(object.x, object.y, object.width, object.height);
    }

    drawDebugInfo(gameState) {
        const lines = this.getDebugLines(gameState);
        this.drawDebugLines(lines);
    }

    getDebugLines(gameState) {
        return [
            `FPS: ${gameState.framesPerSecond}`,
            `x: ${Math.round(gameState.player.x)}`,
            `y: ${Math.round(gameState.player.y)}`,
            `level: ${gameState.currentLevel}`,
            `coins: ${gameState.coins}`
        ];
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