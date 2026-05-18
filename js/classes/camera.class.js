'use strict';

class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
    }

    update(player, level) {
        this.updateHorizontalPosition(player, level);
        this.updateVerticalPosition(player, level);
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }

    updateHorizontalPosition(player, level) {
        const targetX = this.getHorizontalTarget(player);
        const maxX = level.getMaxCameraX(this.canvas.width);

        this.x = this.limitValue(targetX, 0, maxX);
    }

    updateVerticalPosition(player, level) {
        const targetY = this.getVerticalTarget(player);
        const maxY = level.getMaxCameraY(this.canvas.height);

        this.y = this.limitValue(targetY, 0, maxY);
    }

    getHorizontalTarget(player) {
        return player.x - this.canvas.width * GAME_CONFIG.cameraHorizontalFocus;
    }

    getVerticalTarget(player) {
        return player.y - this.canvas.height * GAME_CONFIG.cameraVerticalFocus;
    }

    limitValue(value, minimum, maximum) {
        return Math.min(Math.max(value, minimum), maximum);
    }
}