'use strict';

class Level {
    constructor(levelData) {
        this.number = levelData.number;
        this.width = levelData.width;
        this.height = levelData.height;
        this.backgroundObjects = levelData.backgroundObjects || [];
        this.solidAreas = levelData.solidAreas || [];
    }

    getBounds() {
        return {
            left: 0,
            top: 0,
            right: this.width,
            bottom: this.height
        };
    }

    getMaxCameraX(canvasWidth) {
        return Math.max(0, this.width - canvasWidth);
    }

    getMaxCameraY(canvasHeight) {
        return Math.max(0, this.height - canvasHeight);
    }
}