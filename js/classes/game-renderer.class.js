'use strict';

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    render(gameState) {
        this.clearCanvas();
        this.drawBackground();
        this.drawPlayer(gameState.player);
        this.drawDebugInfo(gameState);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        const gradient = this.createOceanGradient();
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createOceanGradient() {
        const gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a87aa');
        gradient.addColorStop(1, '#03263d');
        return gradient;
    }

    drawPlayer(player) {
        this.context.fillStyle = '#29d3ff';
        this.context.fillRect(player.x, player.y, player.width, player.height);
        this.drawPlayerEye(player);
    }

    drawPlayerEye(player) {
        this.context.fillStyle = '#021018';
        this.context.beginPath();
        this.context.arc(player.x + 52, player.y + 14, 5, 0, Math.PI * 2);
        this.context.fill();
    }

    drawDebugInfo(gameState) {
        if (!gameState.debugMode) {
            return;
        }

        this.context.fillStyle = '#ffffff';
        this.context.font = '16px Arial';
        this.context.fillText(`x: ${Math.round(gameState.player.x)}`, 18, 28);
        this.context.fillText(`y: ${Math.round(gameState.player.y)}`, 18, 50);
        this.context.fillText(`level: ${gameState.currentLevel}`, 18, 72);
    }
}