'use strict';

/**
 * Extends drawable objects with velocity, direction and boundary handling.
 *
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    /**
     * Creates a movable drawable object.
     *
     * @param {number} [x=0] - Initial horizontal position.
     * @param {number} [y=0] - Initial vertical position.
     * @param {number} [width=0] - Rendered width in pixels.
     * @param {number} [height=0] - Rendered height in pixels.
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(x, y, width, height);
        this.speed = 0;
        this.direction = 1;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    /**
     * Applies the current horizontal and vertical velocity.
     *
     * @returns {void}
     */
    updatePosition() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    /**
     * Starts movement to the left at the configured speed.
     *
     * @returns {void}
     */
    moveLeft() {
        this.velocityX = -this.speed;
        this.direction = -1;
    }

    /**
     * Starts movement to the right at the configured speed.
     *
     * @returns {void}
     */
    moveRight() {
        this.velocityX = this.speed;
        this.direction = 1;
    }

    /**
     * Starts upward movement at the configured speed.
     *
     * @returns {void}
     */
    moveUp() {
        this.velocityY = -this.speed;
    }

    /**
     * Starts downward movement at the configured speed.
     *
     * @returns {void}
     */
    moveDown() {
        this.velocityY = this.speed;
    }

    /**
     * Constrains the complete object to rectangular world bounds.
     *
     * @param {Object} bounds - World boundaries.
     * @returns {void}
     */
    keepInsideBounds(bounds) {
        this.keepInsideHorizontalBounds(bounds);
        this.keepInsideVerticalBounds(bounds);
    }

    /**
     * Constrains the object to the horizontal world boundaries.
     *
     * @param {Object} bounds - Horizontal world boundaries.
     * @returns {void}
     */
    keepInsideHorizontalBounds(bounds) {
        this.x = Math.max(bounds.left, this.x);
        this.x = Math.min(bounds.right - this.width, this.x);
    }

    /**
     * Constrains the object to the vertical world boundaries.
     *
     * @param {Object} bounds - Vertical world boundaries.
     * @returns {void}
     */
    keepInsideVerticalBounds(bounds) {
        this.y = Math.max(bounds.top, this.y);
        this.y = Math.min(bounds.bottom - this.height, this.y);
    }

    /**
     * Returns the horizontal coordinate of the right object edge.
     *
     * @returns {number} Right edge position.
     */
    getRightSide() {
        return this.x + this.width;
    }

    /**
     * Returns the vertical coordinate of the bottom object edge.
     *
     * @returns {number} Bottom edge position.
     */
    getBottomSide() {
        return this.y + this.height;
    }

    /**
     * Checks axis-aligned overlap with another drawable object.
     *
     * @param {DrawableObject} object - Object tested for collision.
     * @returns {boolean} Whether both object bounds overlap.
     */
    isCollidingWith(object) {
        return this.getRightSide() > object.x &&
            this.x < object.getRightSide() &&
            this.getBottomSide() > object.y &&
            this.y < object.getBottomSide();
    }
}