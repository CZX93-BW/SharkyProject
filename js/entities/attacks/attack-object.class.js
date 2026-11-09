'use strict';

/**
 * Provides the shared movement, lifetime, hit tracking, and rendering behavior
 * for player attack objects.
 *
 * @extends MovableObject
 */
class AttackObject extends MovableObject {
    /**
     * Creates an attack object from the supplied configuration.
     *
     * @param {Object} [config={}] - Attack configuration.
     * @param {number} [config.x] - Initial horizontal position.
     * @param {number} [config.y] - Initial vertical position.
     * @param {number} [config.width] - Rendered width.
     * @param {number} [config.height] - Rendered height.
     * @param {string} [config.type] - Attack type identifier.
     * @param {number} [config.damage=0] - Direct hit damage.
     * @param {number} [config.speed=0] - Horizontal movement speed.
     * @param {number} [config.direction=1] - Horizontal direction multiplier.
     * @param {number} [config.duration=0] - Lifetime in milliseconds.
     * @param {string} [config.fallbackColor='#ffffff'] - Fallback render color.
     * @param {string} [config.imagePath] - Path to the attack image.
     */
    constructor(config = {}) {
        super(config.x, config.y, config.width, config.height);
        this.type = config.type;
        this.damage = config.damage || 0;
        this.speed = config.speed || 0;
        this.direction = config.direction || 1;
        this.duration = config.duration || 0;
        this.createdAt = GAME_CLOCK.now();
        this.isExpired = false;
        this.hitTargets = new Set();
        this.fallbackColor = config.fallbackColor || '#ffffff';
        this.loadImage(config.imagePath);
    }

    /**
     * Advances the attack and checks whether its lifetime has ended.
     *
     * @returns {void}
     */
    update() {
        this.moveForward();
        this.expireWhenDurationIsOver();
    }

    /**
     * Moves the attack horizontally in its configured direction.
     *
     * @returns {void}
     */
    moveForward() {
        this.x += this.speed * this.direction;
    }

    /**
     * Expires the attack after its configured lifetime.
     *
     * @returns {void}
     */
    expireWhenDurationIsOver() {
        if (GAME_CLOCK.now() - this.createdAt >= this.duration) {
            this.expire();
        }
    }

    /**
     * Marks the attack as expired.
     *
     * @returns {void}
     */
    expire() {
        this.isExpired = true;
    }

    /**
     * Checks the attack lifetime and its previous hits.
     *
     * @param {Object} target - Target to check.
     * @returns {boolean} Whether this attack can still hit the target.
     */
    canHit(target) {
        return this.isActive() && !this.hitTargets.has(target);
    }

    /** @returns {boolean} Whether the current frame can deal a hit. */
    isActive() {
        return !this.isExpired;
    }

    /**
     * Registers a target as hit by this attack.
     *
     * @param {Object} target - Target to register.
     * @returns {void}
     */
    registerHit(target) {
        this.hitTargets.add(target);
    }

    /**
     * Draws the attack image or its fallback representation.
     *
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @returns {void}
     */
    draw(context) {
        if (this.isImageReady()) {
            this.drawAttackImage(context);
            return;
        }
        this.drawFallback(context);
    }

    /**
     * Draws the attack image with the correct orientation.
     *
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @returns {void}
     */
    drawAttackImage(context) {
        if (this.direction === -1) {
            this.drawMirroredAttackImage(context);
            return;
        }
        this.drawImage(context);
    }

    /**
     * Draws a horizontally mirrored attack image.
     *
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @returns {void}
     */
    drawMirroredAttackImage(context) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(
            this.image,
            -this.x - this.width,
            this.y,
            this.width,
            this.height
        );
        context.restore();
    }
}