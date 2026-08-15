'use strict';

class Enemy extends AnimatedDrawableObject {
    constructor(config = {}) {
        super(
            config.x,
            config.y,
            config.width ||
                GAME_CONFIG.enemyWidth,
            config.height ||
                GAME_CONFIG.enemyHeight
        );

        this.startX = this.x;
        this.startY = this.y;
        this.type =
            config.type || 'pufferFish';
        this.speed =
            config.speed ||
            GAME_CONFIG.enemySpeed;
        this.range =
            config.range ||
            GAME_CONFIG.enemyPatrolRange;
        this.axis =
            config.axis || 'horizontal';
        this.damage =
            config.damage ||
            GAME_CONFIG.playerDamageFromEnemy;
        this.maxHealth =
            config.health ||
            GAME_CONFIG.enemyHealth;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.lastDamageTime = 0;
        this.trappedUntil = 0;
        this.poisonDamagePerTick = 0;
        this.poisonEndTime = 0;
        this.nextPoisonTickTime = 0;
        this.poisonTickInterval = 0;
        this.fallbackColor =
            config.fallbackColor ||
            GAME_CONFIG.enemyFallbackColor;
        this.eyeColor =
            GAME_CONFIG.enemyEyeColor;
        this.patrolDirection = 1;

        this.prepareAnimations();

        this.loadImage(
            config.imagePath ||
            this.getDefaultImagePath()
        );

        this.playAnimation('swim', 130);
    }

    /** Registers animations for the enemy type. */
    prepareAnimations() {
        const enemyAssets =
            this.getEnemyAssets();

        this.addAnimation(
            'swim',
            enemyAssets.swim
        );
        this.addAnimation(
            'dead',
            enemyAssets.dead
        );
    }

    /** Returns the configured enemy assets. */
    getEnemyAssets() {
        return ASSET_CONFIG.enemies[this.type] ||
            ASSET_CONFIG.enemies.pufferFish;
    }

    /** Returns the initial enemy image. */
    getDefaultImagePath() {
        return this.getEnemyAssets().swim[0] ||
            ASSET_CONFIG.enemies.default;
    }

    /** Updates animation, effects and movement. */
    update(solidAreas = []) {
        if (this.isDefeated) {
            this.playAnimation(
                'dead',
                140,
                false
            );
            return;
        }

        this.updatePoisonStatus();
        this.playAnimation('swim', 130);

        if (this.isTrapped()) {
            return;
        }

        this.updatePatrolWithSolidAreas(
            solidAreas
        );
    }

    /** Moves the enemy and checks solid areas. */
    updatePatrolWithSolidAreas(solidAreas) {
        const previousPosition = {
            x: this.x,
            y: this.y
        };

        this.updatePatrol();

        if (
            this.isTouchingSolidArea(
                solidAreas
            )
        ) {
            this.restorePosition(
                previousPosition
            );
            this.reversePatrolDirection();
        }
    }

    /** Checks whether the enemy overlaps an area. */
    isTouchingSolidArea(solidAreas) {
        return solidAreas.some(
            (solidArea) => {
                return this.x + this.width >
                    solidArea.x &&
                    this.x <
                    solidArea.x +
                    solidArea.width &&
                    this.y + this.height >
                    solidArea.y &&
                    this.y <
                    solidArea.y +
                    solidArea.height;
            }
        );
    }

    /** Restores the position before a collision. */
    restorePosition(previousPosition) {
        this.x = previousPosition.x;
        this.y = previousPosition.y;
    }

    /** Reverses the current patrol direction. */
    reversePatrolDirection() {
        this.patrolDirection *= -1;
        this.direction =
            this.patrolDirection;
    }

    /** Updates horizontal or vertical patrol. */
    updatePatrol() {
        if (this.axis === 'vertical') {
            this.updateVerticalPatrol();
            return;
        }

        this.updateHorizontalPatrol();
    }

    /** Updates horizontal patrol movement. */
    updateHorizontalPatrol() {
        this.x +=
            this.speed *
            this.patrolDirection;

        this.changeDirectionAtHorizontalBounds();
        this.direction =
            this.patrolDirection;
    }

    /** Updates vertical patrol movement. */
    updateVerticalPatrol() {
        this.y +=
            this.speed *
            this.patrolDirection;

        this.changeDirectionAtVerticalBounds();
    }

    /** Reverses at horizontal patrol limits. */
    changeDirectionAtHorizontalBounds() {
        if (
            this.x <= this.startX ||
            this.x >=
                this.startX + this.range
        ) {
            this.patrolDirection *= -1;
        }
    }

    /** Reverses at vertical patrol limits. */
    changeDirectionAtVerticalBounds() {
        if (
            this.y <= this.startY ||
            this.y >=
                this.startY + this.range
        ) {
            this.patrolDirection *= -1;
        }
    }

    /** Applies immediate damage. */
    takeDamage(damage) {
        if (this.isDefeated) {
            return;
        }

        this.health = Math.max(
            0,
            this.health - damage
        );
        this.lastDamageTime = Date.now();

        this.updateDefeatedState();
    }

    /** Starts the death state at zero health. */
    updateDefeatedState() {
        if (
            this.health > 0 ||
            this.isDefeated
        ) {
            return;
        }

        this.isDefeated = true;
        this.clearExpiredPoison();

        this.playAnimation(
            'dead',
            140,
            false
        );
    }

    /** Applies poison damage over time. */
    applyPoison(
        damagePerTick,
        duration,
        tickInterval
    ) {
        if (this.isDefeated) {
            return;
        }

        this.poisonDamagePerTick =
            damagePerTick;
        this.poisonEndTime =
            Date.now() + duration;
        this.poisonTickInterval =
            tickInterval;
        this.nextPoisonTickTime =
            Date.now() + tickInterval;
    }

    /** Updates the poison effect. */
    updatePoisonStatus() {
        if (!this.isPoisoned()) {
            this.clearExpiredPoison();
            return;
        }

        this.applyPoisonTickIfNeeded();
    }

    /** Applies an elapsed poison tick. */
    applyPoisonTickIfNeeded() {
        if (
            Date.now() >=
            this.nextPoisonTickTime
        ) {
            this.takeDamage(
                this.poisonDamagePerTick
            );

            this.nextPoisonTickTime =
                Date.now() +
                this.poisonTickInterval;
        }
    }

    /** Returns whether poison is active. */
    isPoisoned() {
        return Date.now() <
            this.poisonEndTime &&
            this.poisonDamagePerTick > 0;
    }

    /** Removes the poison effect. */
    clearExpiredPoison() {
        this.poisonDamagePerTick = 0;
    }

    /** Returns whether hurt feedback is active. */
    isHurt() {
        return Date.now() -
            this.lastDamageTime <
            GAME_CONFIG.enemyHurtDuration;
    }

    /** Traps the enemy temporarily. */
    trap(duration) {
        if (this.canBeTrapped()) {
            this.trappedUntil =
                Date.now() + duration;
        }
    }

    /** Returns whether the enemy can be trapped. */
    canBeTrapped() {
        return !this.isDefeated;
    }

    /** Returns whether the enemy is trapped. */
    isTrapped() {
        return Date.now() <
            this.trappedUntil;
    }

    /** Returns whether contact causes damage. */
    canDealContactDamage() {
        return !this.isDefeated &&
            !this.isTrapped();
    }

    /** Resets the complete enemy state. */
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.lastDamageTime = 0;
        this.trappedUntil = 0;
        this.clearExpiredPoison();
        this.patrolDirection = 1;
        this.direction = 1;
        this.playAnimation('swim', 130);
    }

    /** Draws the enemy while its death is active. */
    draw(context) {
        if (
            this.isDefeated &&
            this.isAnimationFinished()
        ) {
            return;
        }

        this.drawEnemy(context);

        if (!this.isDefeated) {
            this.drawStatusIndicators(context);
        }
    }

    /** Draws the image or fallback enemy. */
    drawEnemy(context) {
        if (this.isImageReady()) {
            this.drawEnemyImage(context);
            return;
        }

        super.draw(context);
        this.drawFallbackDetails(context);
    }

    /** Draws the enemy with its direction. */
    drawEnemyImage(context) {
        if (this.direction === -1) {
            this.drawMirroredEnemyImage(
                context
            );
            return;
        }

        this.drawImage(context);
    }

    /** Draws a horizontally mirrored enemy. */
    drawMirroredEnemyImage(context) {
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

    /** Draws fallback enemy details. */
    drawFallbackDetails(context) {
        this.drawEnemyEye(context);
        this.drawEnemyTentacles(context);
    }

    /** Draws the fallback eye. */
    drawEnemyEye(context) {
        context.fillStyle = this.eyeColor;
        context.beginPath();

        context.arc(
            this.x + this.width / 2,
            this.y + 18,
            6,
            0,
            Math.PI * 2
        );

        context.fill();
    }

    /** Draws fallback tentacles. */
    drawEnemyTentacles(context) {
        context.strokeStyle =
            this.fallbackColor;
        context.lineWidth = 4;

        this.drawTentacle(context, 14);
        this.drawTentacle(context, 29);
        this.drawTentacle(context, 44);
    }

    /** Draws one fallback tentacle. */
    drawTentacle(context, offsetX) {
        context.beginPath();

        context.moveTo(
            this.x + offsetX,
            this.y + this.height - 8
        );

        context.lineTo(
            this.x + offsetX - 6,
            this.y + this.height + 18
        );

        context.stroke();
    }

    /** Draws active effect indicators. */
    drawStatusIndicators(context) {
        this.drawHurtIndicator(context);
        this.drawTrapIndicator(context);
        this.drawPoisonIndicator(context);
    }

    /** Draws hurt feedback. */
    drawHurtIndicator(context) {
        if (!this.isHurt()) {
            return;
        }

        context.strokeStyle = '#ffffff';
        context.lineWidth = 3;

        context.strokeRect(
            this.x - 4,
            this.y - 4,
            this.width + 8,
            this.height + 8
        );
    }

    /** Draws the trap indicator. */
    drawTrapIndicator(context) {
        if (!this.isTrapped()) {
            return;
        }

        context.strokeStyle =
            'rgba(169, 236, 255, 0.9)';
        context.lineWidth = 4;

        context.strokeRect(
            this.x - 5,
            this.y - 5,
            this.width + 10,
            this.height + 10
        );
    }

    /** Draws the poison indicator. */
    drawPoisonIndicator(context) {
        if (!this.isPoisoned()) {
            return;
        }

        context.strokeStyle = '#9dff57';
        context.lineWidth = 3;

        context.strokeRect(
            this.x - 9,
            this.y - 9,
            this.width + 18,
            this.height + 18
        );
    }
}