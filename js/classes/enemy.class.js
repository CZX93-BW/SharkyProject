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
        this.baseDamage = this.damage;
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
        this.isInflated = false;
        this.isTransitioning = false;

        this.prepareAnimations();

        this.loadImage(
            config.imagePath ||
            this.getDefaultImagePath()
        );

        this.playAnimation(
            'swim',
            GAME_CONFIG.pufferSwimFrameDuration
        );
    }

    /** Registers available enemy animations. */
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

        if (enemyAssets.transition) {
            this.addAnimation(
                'transition',
                enemyAssets.transition
            );
        }

        if (enemyAssets.inflatedSwim) {
            this.addAnimation(
                'inflatedSwim',
                enemyAssets.inflatedSwim
            );
        }
    }

    /** Returns assets for the configured type. */
    getEnemyAssets() {
        return ASSET_CONFIG.enemies[this.type] ||
            ASSET_CONFIG.enemies.pufferFish;
    }

    /** Returns the first enemy image. */
    getDefaultImagePath() {
        return this.getEnemyAssets().swim[0] ||
            ASSET_CONFIG.enemies.default;
    }

    /** Updates effects, animation and movement. */
    update(solidAreas = [], player = null) {
        if (this.isDefeated) {
            this.playAnimation(
                'dead',
                140,
                false
            );
            return;
        }

        this.updatePoisonStatus();
        this.updateAnimationState(player);

        if (this.isTrapped()) {
            return;
        }

        this.updatePatrolWithSolidAreas(
            solidAreas
        );
    }

    /** Selects the animation for the enemy type. */
    updateAnimationState(player) {
        if (this.type !== 'pufferFish') {
            this.playAnimation(
                'swim',
                GAME_CONFIG
                    .pufferSwimFrameDuration
            );
            return;
        }

        this.updatePufferAnimation(player);
    }

    /** Updates the pufferfish state machine. */
    updatePufferAnimation(player) {
        if (this.isTransitioning) {
            this.updatePufferTransition();
            return;
        }

        if (this.isInflated) {
            this.playAnimation(
                'inflatedSwim',
                GAME_CONFIG
                    .pufferSwimFrameDuration
            );
            return;
        }

        if (
            this.isPlayerInsidePufferRange(
                player
            )
        ) {
            this.startPufferTransition();
            return;
        }

        this.playAnimation(
            'swim',
            GAME_CONFIG.pufferSwimFrameDuration
        );
    }

    /** Starts the one-time inflation animation. */
    startPufferTransition() {
        this.isTransitioning = true;

        this.playAnimation(
            'transition',
            GAME_CONFIG
                .pufferTransitionFrameDuration,
            false
        );
    }

    /** Advances the inflation animation. */
    updatePufferTransition() {
        this.playAnimation(
            'transition',
            GAME_CONFIG
                .pufferTransitionFrameDuration,
            false
        );

        if (this.isAnimationFinished()) {
            this.finishPufferTransition();
        }
    }

    /** Activates the inflated pufferfish state. */
    finishPufferTransition() {
        this.isTransitioning = false;
        this.isInflated = true;
        this.damage =
            GAME_CONFIG.pufferInflatedDamage;

        this.playAnimation(
            'inflatedSwim',
            GAME_CONFIG.pufferSwimFrameDuration
        );
    }

    /** Checks Sharky's distance to the pufferfish. */
    isPlayerInsidePufferRange(player) {
        if (!player) {
            return false;
        }

        const horizontalDistance =
            player.x - this.x;
        const verticalDistance =
            player.y - this.y;
        const distance = Math.hypot(
            horizontalDistance,
            verticalDistance
        );

        return distance <=
            GAME_CONFIG
                .pufferActivationDistance;
    }

    /** Moves the enemy and handles barriers. */
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

    /** Checks overlap with solid areas. */
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

    /** Restores the previous position. */
    restorePosition(previousPosition) {
        this.x = previousPosition.x;
        this.y = previousPosition.y;
    }

    /** Reverses the patrol direction. */
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

    /** Updates horizontal movement. */
    updateHorizontalPatrol() {
        this.x +=
            this.speed *
            this.patrolDirection;

        this.changeDirectionAtHorizontalBounds();
        this.direction =
            this.patrolDirection;
    }

    /** Updates vertical movement. */
    updateVerticalPatrol() {
        this.y +=
            this.speed *
            this.patrolDirection;

        this.changeDirectionAtVerticalBounds();
    }

    /** Reverses at horizontal bounds. */
    changeDirectionAtHorizontalBounds() {
        if (
            this.x <= this.startX ||
            this.x >=
                this.startX + this.range
        ) {
            this.patrolDirection *= -1;
        }
    }

    /** Reverses at vertical bounds. */
    changeDirectionAtVerticalBounds() {
        if (
            this.y <= this.startY ||
            this.y >=
                this.startY + this.range
        ) {
            this.patrolDirection *= -1;
        }
    }

    /** Applies direct damage. */
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

    /** Starts the death animation. */
    updateDefeatedState() {
        if (
            this.health > 0 ||
            this.isDefeated
        ) {
            return;
        }

        this.isDefeated = true;
        this.isTransitioning = false;
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

    /** Checks whether poison is active. */
    isPoisoned() {
        return Date.now() <
            this.poisonEndTime &&
            this.poisonDamagePerTick > 0;
    }

    /** Removes poison damage. */
    clearExpiredPoison() {
        this.poisonDamagePerTick = 0;
    }

    /** Checks whether hurt feedback is active. */
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

    canBeTrapped() {
        return !this.isDefeated;
    }

    isTrapped() {
        return Date.now() <
            this.trappedUntil;
    }

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
        this.isInflated = false;
        this.isTransitioning = false;
        this.damage = this.baseDamage;

        this.playAnimation(
            'swim',
            GAME_CONFIG.pufferSwimFrameDuration
        );
    }

    /** Draws the active enemy. */
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

    /** Draws the image or fallback. */
    drawEnemy(context) {
        if (this.isImageReady()) {
            this.drawEnemyImage(context);
            return;
        }

        super.draw(context);
        this.drawFallbackDetails(context);
    }

    /** Draws the enemy facing its direction. */
    drawEnemyImage(context) {
        if (this.direction === -1) {
            this.drawMirroredEnemyImage(
                context
            );
            return;
        }

        this.drawImage(context);
    }

    /** Draws the mirrored enemy image. */
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

    /** Draws fallback details. */
    drawFallbackDetails(context) {
        this.drawEnemyEye(context);
        this.drawEnemyTentacles(context);
    }

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

    drawEnemyTentacles(context) {
        context.strokeStyle =
            this.fallbackColor;
        context.lineWidth = 4;

        this.drawTentacle(context, 14);
        this.drawTentacle(context, 29);
        this.drawTentacle(context, 44);
    }

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

    drawStatusIndicators(context) {
        this.drawHurtIndicator(context);
        this.drawTrapIndicator(context);
        this.drawPoisonIndicator(context);
    }

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