'use strict';

/** Controls boss patrol, pursuit, collision movement, and sprite direction. */
class BossMovementController {
    /** @param {Endboss} boss - Boss instance controlled by this strategy. */
    constructor(boss) {
        this.boss = boss;
        this.reset();
    }

    /** Restores direction and patrol state for a new level attempt. */
    reset() {
        this.boss.direction = -1;
        this.patrolDirection = 1;
    }

    /**
     * @param {Object[]} solidAreas - Blocking world areas.
     * @param {Object|null} bounds - Optional level movement boundaries.
     */
    updatePatrol(solidAreas, bounds) {
        const target = this.getPatrolTarget();
        this.facePatrolTarget(target);
        const moved = this.moveTowardsPoint(
            target.x, target.y, this.boss.speed, solidAreas, bounds
        );

        if (!moved || this.isAtPoint(target)) {
            this.patrolDirection *= -1;
        }
    }

    /** @returns {Object} Active endpoint of the configured patrol route. */
    getPatrolTarget() {
        const offset = this.boss.range * this.patrolDirection;
        return this.boss.axis === 'horizontal' ?
            { x: this.boss.startX + offset, y: this.boss.startY } :
            { x: this.boss.startX, y: this.boss.startY + offset };
    }

    /** @param {Object} target - Current patrol target point. */
    facePatrolTarget(target) {
        if (this.boss.axis === 'horizontal') {
            this.faceTargetX(target.x);
            return;
        }
        this.boss.direction = -1;
    }

    /**
     * @param {Object} target - Movement target point.
     * @returns {boolean} Whether the boss reached the target.
     */
    isAtPoint(target) {
        const distance = Math.hypot(
            target.x - this.boss.x,
            target.y - this.boss.y
        );
        return distance <= Math.max(0.5, this.boss.speed);
    }

    /**
     * @param {number} targetX - Horizontal target position.
     * @param {number} targetY - Vertical target position.
     * @param {number} speed - Movement distance for this frame.
     * @param {Object[]} solidAreas - Blocking world areas.
     * @param {Object|null} bounds - Optional level movement boundaries.
     * @returns {boolean} Whether the boss changed position.
     */
    moveTowardsPoint(targetX, targetY, speed, solidAreas, bounds) {
        const deltaX = targetX - this.boss.x;
        const deltaY = targetY - this.boss.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance <= 0.001) {
            return false;
        }

        const step = Math.min(speed, distance);
        return this.moveWithCollision(
            deltaX / distance * step,
            deltaY / distance * step,
            solidAreas,
            bounds
        );
    }

    /**
     * @param {number} deltaX - Horizontal movement delta.
     * @param {number} deltaY - Vertical movement delta.
     * @param {Object[]} solidAreas - Blocking world areas.
     * @param {Object|null} bounds - Optional level movement boundaries.
     * @returns {boolean} Whether any movement attempt succeeded.
     */
    moveWithCollision(deltaX, deltaY, solidAreas, bounds) {
        if (this.tryMove(deltaX, deltaY, solidAreas, bounds)) {
            return true;
        }

        const movedHorizontally = this.tryMove(
            deltaX, 0, solidAreas, bounds
        );
        const movedVertically = this.tryMove(
            0, deltaY, solidAreas, bounds
        );
        return movedHorizontally || movedVertically;
    }

    /**
     * @param {number} deltaX - Horizontal movement delta.
     * @param {number} deltaY - Vertical movement delta.
     * @param {Object[]} solidAreas - Blocking world areas.
     * @param {Object|null} bounds - Optional level movement boundaries.
     * @returns {boolean} Whether the movement remained collision-free.
     */
    tryMove(deltaX, deltaY, solidAreas, bounds) {
        const previousPosition = {
            x: this.boss.x,
            y: this.boss.y
        };
        this.boss.x += deltaX;
        this.boss.y += deltaY;
        this.keepInsideBounds(bounds);

        if (!this.boss.isTouchingSolidArea(solidAreas)) {
            return true;
        }

        this.boss.restorePosition(previousPosition);
        return false;
    }

    /** @param {Object|null} bounds - Optional level movement boundaries. */
    keepInsideBounds(bounds) {
        if (bounds) {
            this.boss.keepInsideBounds(bounds);
        }
    }

    /**
     * @param {Character} player - Current player character.
     * @returns {Object} Target aligning boss and player centers.
     */
    getPlayerTargetPoint(player) {
        return {
            x: this.getObjectCenterX(player) - this.boss.width / 2,
            y: this.getObjectCenterY(player) - this.boss.height / 2
        };
    }

    /**
     * @param {Character|null} player - Current player character.
     * @returns {number} Center distance between the boss and player.
     */
    getDistanceToPlayer(player) {
        if (!player) {
            return Number.POSITIVE_INFINITY;
        }

        const deltaX = this.getCenterX() - this.getObjectCenterX(player);
        const deltaY = this.getCenterY() - this.getObjectCenterY(player);
        return Math.hypot(deltaX, deltaY);
    }

    /** @returns {number} Distance from the configured boss home point. */
    getDistanceFromHome() {
        return Math.hypot(
            this.boss.x - this.boss.startX,
            this.boss.y - this.boss.startY
        );
    }

    /** @returns {boolean} Whether the boss exceeded its pursuit zone. */
    isOutsideLeash() {
        return this.getDistanceFromHome() > this.boss.leashDistance;
    }

    /** @returns {boolean} Whether patrol still covers the position. */
    isInsideHomeArea() {
        const horizontalDistance = Math.abs(this.boss.x - this.boss.startX);
        const verticalDistance = Math.abs(this.boss.y - this.boss.startY);

        if (this.boss.axis === 'horizontal') {
            return verticalDistance <= 2 &&
                horizontalDistance <= this.boss.range;
        }

        return horizontalDistance <= 2 &&
            verticalDistance <= this.boss.range;
    }

    /** @returns {boolean} Whether the boss reached its home point. */
    isAtHomePosition() {
        const tolerance = Math.max(2, this.boss.speed);
        return this.getDistanceFromHome() <= tolerance;
    }

    /** @param {Character} player - Current player character. */
    facePlayer(player) {
        this.faceTargetX(this.getObjectCenterX(player));
    }

    /** @param {number} targetX - Horizontal world position to face. */
    faceTargetX(targetX) {
        this.boss.direction = targetX < this.getCenterX() ? -1 : 1;
    }

    /** @returns {boolean} Whether the source sprite must be mirrored. */
    shouldMirrorSprite() {
        return this.boss.direction > 0;
    }

    /** @returns {number} Aggression-scaled pursuit speed. */
    getChaseSpeed() {
        return this.boss.speed * (1 + this.boss.aggression * 0.6);
    }

    /** @returns {number} Aggression-scaled contact-attack speed. */
    getAttackSpeed() {
        return this.boss.speed * (1.4 + this.boss.aggression * 0.8);
    }

    /** @returns {number} Aggression-scaled return speed. */
    getReturnSpeed() {
        return this.boss.speed * (1.1 + this.boss.aggression * 0.4);
    }

    /** @returns {number} Boss center on the horizontal axis. */
    getCenterX() {
        return this.boss.x + this.boss.width / 2;
    }

    /** @returns {number} Boss center on the vertical axis. */
    getCenterY() {
        return this.boss.y + this.boss.height / 2;
    }

    /**
     * @param {DrawableObject} object - Object whose center is requested.
     * @returns {number} Object center on the horizontal axis.
     */
    getObjectCenterX(object) {
        return object.x + object.width / 2;
    }

    /**
     * @param {DrawableObject} object - Object whose center is requested.
     * @returns {number} Object center on the vertical axis.
     */
    getObjectCenterY(object) {
        return object.y + object.height / 2;
    }
}