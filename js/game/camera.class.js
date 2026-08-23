'use strict';

/** Tracks a clamped viewport around the player inside the active level. */
class Camera {
    /** @param {HTMLCanvasElement} canvas - Canvas defining viewport dimensions. */
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Level} level - Active level defining camera limits.
     */
    update(player, level) {
        this.updateHorizontalPosition(player, level);
        this.updateVerticalPosition(player, level);
    }

    /** Restores the viewport to the world origin. */
    reset() {
        this.x = 0;
        this.y = 0;
    }

    /** @returns {Object} Current visible world rectangle. */
    getVisibleBounds() {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.canvas.width,
            bottom: this.y + this.canvas.height,
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Level} level - Active level defining camera limits.
     */
    updateHorizontalPosition(player, level) {
        const targetX = this.getHorizontalTarget(player);
        const maxX = level.getMaxCameraX(this.canvas.width);
        this.x = this.limitValue(targetX, 0, maxX);
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Level} level - Active level defining camera limits.
     */
    updateVerticalPosition(player, level) {
        const targetY = this.getVerticalTarget(player);
        const maxY = level.getMaxCameraY(this.canvas.height);
        this.y = this.limitValue(targetY, 0, maxY);
    }

    /**
     * @param {Character} player - Current player character.
     * @returns {number} Unclamped horizontal camera target.
     */
    getHorizontalTarget(player) {
        return player.x -
            this.canvas.width * GAME_CONFIG.cameraHorizontalFocus;
    }

    /**
     * @param {Character} player - Current player character.
     * @returns {number} Unclamped vertical camera target.
     */
    getVerticalTarget(player) {
        return player.y -
            this.canvas.height * GAME_CONFIG.cameraVerticalFocus;
    }

    /**
     * @param {number} value - Value to restrict.
     * @param {number} minimum - Smallest allowed value.
     * @param {number} maximum - Largest allowed value.
     * @returns {number} Value restricted to the supplied range.
     */
    limitValue(value, minimum, maximum) {
        return Math.min(Math.max(value, minimum), maximum);
    }
}