'use strict';

class BossMovementController {
    /** Creates collision-aware movement for one boss instance. */
    constructor(boss) {
        this.boss = boss;
    }

    /** Moves towards a point and resolves solid-area collisions. */
    moveTowardsPoint(
        targetX,
        targetY,
        speed,
        solidAreas,
        bounds
    ) {
        const deltaX = targetX - this.boss.x;
        const deltaY = targetY - this.boss.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance <= 0.001) {
            return;
        }

        const step = Math.min(speed, distance);

        this.moveWithCollision(
            deltaX / distance * step,
            deltaY / distance * step,
            solidAreas,
            bounds
        );
    }

    /** Tries diagonal movement before falling back to each axis. */
    moveWithCollision(
        deltaX,
        deltaY,
        solidAreas,
        bounds
    ) {
        if (this.tryMove(deltaX, deltaY, solidAreas, bounds)) {
            return;
        }

        this.tryMove(deltaX, 0, solidAreas, bounds);
        this.tryMove(0, deltaY, solidAreas, bounds);
    }

    /** Applies one movement attempt and rolls it back on collision. */
    tryMove(
        deltaX,
        deltaY,
        solidAreas,
        bounds
    ) {
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

    /** Keeps the full scaled hitbox inside the level. */
    keepInsideBounds(bounds) {
        if (bounds) {
            this.boss.keepInsideBounds(bounds);
        }
    }

    /** Returns a target that aligns the boss and player centers. */
    getPlayerTargetPoint(player) {
        return {
            x: this.getObjectCenterX(player) - this.boss.width / 2,
            y: this.getObjectCenterY(player) - this.boss.height / 2
        };
    }

    /** Returns the center distance between the boss and Sharky. */
    getDistanceToPlayer(player) {
        if (!player) {
            return Number.POSITIVE_INFINITY;
        }

        const deltaX =
            this.getCenterX() - this.getObjectCenterX(player);

        const deltaY =
            this.getCenterY() - this.getObjectCenterY(player);

        return Math.hypot(deltaX, deltaY);
    }

    /** Returns the distance from the configured boss home point. */
    getDistanceFromHome() {
        return Math.hypot(
            this.boss.x - this.boss.startX,
            this.boss.y - this.boss.startY
        );
    }

    /** Returns whether the boss exceeded its allowed pursuit zone. */
    isOutsideLeash() {
        return this.getDistanceFromHome() > this.boss.leashDistance;
    }

    /** Returns whether regular patrol still covers the position. */
    isInsideHomeArea() {
        const horizontalDistance = Math.abs(
            this.boss.x - this.boss.startX
        );

        const verticalDistance = Math.abs(
            this.boss.y - this.boss.startY
        );

        if (this.boss.axis === 'horizontal') {
            return verticalDistance <= 2 &&
                horizontalDistance <= this.boss.range;
        }

        return horizontalDistance <= 2 &&
            verticalDistance <= this.boss.range;
    }

    /** Returns whether the boss has reached its exact home point. */
    isAtHomePosition() {
        const tolerance = Math.max(2, this.boss.speed);
        return this.getDistanceFromHome() <= tolerance;
    }

    /** Faces Sharky before pursuing or attacking. */
    facePlayer(player) {
        this.faceTargetX(this.getObjectCenterX(player));
    }

    /** Faces one horizontal world position. */
    faceTargetX(targetX) {
        this.boss.direction =
            targetX < this.getCenterX() ? -1 : 1;
    }

    /** Calculates the aggression-scaled pursuit speed. */
    getChaseSpeed() {
        return this.boss.speed *
            (1 + this.boss.aggression * 0.6);
    }

    /** Calculates the faster contact-attack speed. */
    getAttackSpeed() {
        return this.boss.speed *
            (1.4 + this.boss.aggression * 0.8);
    }

    /** Calculates a stable return speed. */
    getReturnSpeed() {
        return this.boss.speed *
            (1.1 + this.boss.aggression * 0.4);
    }

    /** Returns the boss center on the x-axis. */
    getCenterX() {
        return this.boss.x + this.boss.width / 2;
    }

    /** Returns the boss center on the y-axis. */
    getCenterY() {
        return this.boss.y + this.boss.height / 2;
    }

    /** Returns another object's center on the x-axis. */
    getObjectCenterX(object) {
        return object.x + object.width / 2;
    }

    /** Returns another object's center on the y-axis. */
    getObjectCenterY(object) {
        return object.y + object.height / 2;
    }
}