'use strict';

/** Applies the configured movement profile to one standard enemy. */
class EnemyMovementController {
    /**
     * @param {Enemy} enemy - Enemy controlled by this strategy.
     * @param {Object} [config={}] - Movement profile configuration.
     */
    constructor(enemy, config = {}) {
        this.enemy = enemy;
        this.profile = config.profile || 'waveLeft';
        this.horizontalSpeed =
            config.horizontalSpeed || GAME_CONFIG.enemySpeed;
        this.verticalSpeed =
            config.verticalSpeed || GAME_CONFIG.enemySpeed;
        this.verticalRange =
            config.verticalRange || GAME_CONFIG.enemyPatrolRange;
        this.waveAmplitude = config.waveAmplitude || 0;
        this.waveFrequency = config.waveFrequency || 0;
        this.spriteFacing = config.spriteFacing || 'left';
        this.worldTop = config.worldTop ?? 20;
        this.worldBottom = config.worldBottom ?? GAME_CONFIG.canvasHeight;
        this.initialPhase = config.initialPhase || 0;
        this.initialVerticalDirection = config.initialVerticalDirection || 1;
        this.reset();
    }

    /** Restores movement state to the enemy's current spawn position. */
    reset() {
        this.originY = this.enemy.startY;
        this.wavePhase = this.initialPhase;
        this.verticalDirection = this.initialVerticalDirection;
        this.enemy.direction = -1;
        this.updateVerticalBounds();
    }

    /** Calculates safe vertical limits around the spawn position. */
    updateVerticalBounds() {
        const halfRange = this.verticalRange / 2;
        this.minimumY = Math.max(this.worldTop, this.originY - halfRange);
        this.maximumY = Math.min(
            this.worldBottom - this.enemy.height,
            this.originY + halfRange
        );
    }

    /** Advances the configured movement strategy by one game frame. */
    update() {
        if (this.profile === 'verticalDrift') {
            this.updateVerticalDrift();
            return;
        }
        this.updateWaveLeft();
    }

    /** Moves a pufferfish left while following a sine wave. */
    updateWaveLeft() {
        this.enemy.x -= this.horizontalSpeed;
        this.wavePhase += this.waveFrequency;
        const nextY = this.originY +
            Math.sin(this.wavePhase) * this.waveAmplitude;
        this.enemy.y = this.clampVerticalPosition(nextY);
        this.enemy.direction = -1;
    }

    /** Moves a jellyfish mainly vertically with a slight left drift. */
    updateVerticalDrift() {
        this.enemy.x -= this.horizontalSpeed;
        this.enemy.y += this.verticalSpeed * this.verticalDirection;
        this.reverseAtVerticalBounds();
        this.enemy.direction = -1;
    }

    /** Reverses vertical motion at the configured limits. */
    reverseAtVerticalBounds() {
        if (this.enemy.y <= this.minimumY) {
            this.enemy.y = this.minimumY;
            this.verticalDirection = 1;
        }

        if (this.enemy.y >= this.maximumY) {
            this.enemy.y = this.maximumY;
            this.verticalDirection = -1;
        }
    }

    /** Changes the vertical route after hitting a solid object. */
    handleObstacle() {
        if (this.profile === 'waveLeft') {
            this.wavePhase = Math.PI - this.wavePhase;
            return;
        }
        this.verticalDirection *= -1;
    }

    /**
     * @param {number} value - Vertical position to restrict.
     * @returns {number} Position clamped to the movement limits.
     */
    clampVerticalPosition(value) {
        return Math.min(Math.max(value, this.minimumY), this.maximumY);
    }

    /** @returns {boolean} Whether the source sprite must be mirrored. */
    shouldMirrorSprite() {
        if (this.spriteFacing === 'neutral') {
            return false;
        }

        const movementFacing = this.enemy.direction < 0 ? 'left' : 'right';
        return movementFacing !== this.spriteFacing;
    }
}