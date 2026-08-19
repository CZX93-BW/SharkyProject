'use strict';

class Enemy extends AnimatedDrawableObject {
    constructor(config = {}) {
        super(
            config.x,
            config.y,
            config.width || GAME_CONFIG.enemyWidth,
            config.height || GAME_CONFIG.enemyHeight
        );

        this.startX = this.x;
        this.startY = this.y;
        this.type = config.type || 'pufferFish';
        this.damage = config.damage || GAME_CONFIG.playerDamageFromEnemy;
        this.baseDamage = this.damage;
        this.maxHealth = config.health || GAME_CONFIG.enemyHealth;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.lastDamageTime = 0;
        this.trappedUntil = 0;
        this.poisonDamagePerTick = 0;
        this.poisonEndTime = 0;
        this.nextPoisonTickTime = 0;
        this.poisonTickInterval = 0;
        this.fallbackColor = config.fallbackColor || GAME_CONFIG.enemyFallbackColor;
        this.eyeColor = GAME_CONFIG.enemyEyeColor;
        this.isInflated = false;
        this.isTransitioning = false;
        this.movementController = new EnemyMovementController(
            this,
            config.movement
        );
        this.prepareAnimations();
        this.loadImage(config.imagePath || this.getDefaultImagePath());
        this.playAnimation('swim', 130);
    }

    /** Registers animations belonging to the configured enemy type. */
    prepareAnimations() {
        const enemyAssets = this.getEnemyAssets();
        this.addAnimation('swim', enemyAssets.swim);
        this.addAnimation('dead', enemyAssets.dead);

        if (enemyAssets.transition) {
            this.addAnimation('transition', enemyAssets.transition);
        }

        if (enemyAssets.inflatedSwim) {
            this.addAnimation('inflatedSwim', enemyAssets.inflatedSwim);
        }
    }

    /** Returns configured assets or the Pufferfish fallback. */
    getEnemyAssets() {
        return ASSET_CONFIG.enemies[this.type] ||
            ASSET_CONFIG.enemies.pufferFish;
    }

    /** Returns the first frame used before animation begins. */
    getDefaultImagePath() {
        return this.getEnemyAssets().swim[0] ||
            ASSET_CONFIG.enemies.default;
    }

    update(solidAreas = [], player = null) {
        if (this.isDefeated) {
            this.playAnimation('dead', 140, false);
            return;
        }

        this.updatePoisonStatus();
        this.updateAnimationState(player);

        if (this.isTrapped()) {
            return;
        }

        this.updateMovementWithSolidAreas(solidAreas);
    }

    updateAnimationState(player) {
        if (this.type !== 'pufferFish') {
            this.playAnimation('swim', GAME_CONFIG.pufferSwimFrameDuration);
            return;
        }

        this.updatePufferAnimation(player);
    }

    updatePufferAnimation(player) {
        if (this.isTransitioning) {
            this.updatePufferTransition();
            return;
        }

        if (this.isInflated) {
            this.playAnimation(
                'inflatedSwim',
                GAME_CONFIG.pufferSwimFrameDuration
            );
            return;
        }

        if (this.isPlayerInsidePufferRange(player)) {
            this.startPufferTransition();
            return;
        }

        this.playAnimation('swim', GAME_CONFIG.pufferSwimFrameDuration);
    }

    startPufferTransition() {
        this.isTransitioning = true;
        this.playAnimation(
            'transition',
            GAME_CONFIG.pufferTransitionFrameDuration,
            false
        );
    }

    updatePufferTransition() {
        this.playAnimation(
            'transition',
            GAME_CONFIG.pufferTransitionFrameDuration,
            false
        );

        if (this.isAnimationFinished()) {
            this.finishPufferTransition();
        }
    }

    finishPufferTransition() {
        this.isTransitioning = false;
        this.isInflated = true;
        this.damage = GAME_CONFIG.pufferInflatedDamage;
        this.playAnimation(
            'inflatedSwim',
            GAME_CONFIG.pufferSwimFrameDuration
        );
    }

    isPlayerInsidePufferRange(player) {
        if (!player) {
            return false;
        }

        const horizontalDistance = player.x - this.x;
        const verticalDistance = player.y - this.y;
        return Math.hypot(horizontalDistance, verticalDistance) <=
            GAME_CONFIG.pufferActivationDistance;
    }

    /** Moves the enemy and reacts to solid level objects. */
    updateMovementWithSolidAreas(solidAreas) {
        const previousPosition = {
            x: this.x,
            y: this.y
        };

        this.movementController.update();

        if (this.isTouchingSolidArea(solidAreas)) {
            this.restorePosition(previousPosition);
            this.movementController.handleObstacle();
        }
    }

    isTouchingSolidArea(solidAreas) {
        return solidAreas.some((solidArea) => {
            return this.x + this.width > solidArea.x &&
                this.x < solidArea.x + solidArea.width &&
                this.y + this.height > solidArea.y &&
                this.y < solidArea.y + solidArea.height;
        });
    }

    restorePosition(previousPosition) {
        this.x = previousPosition.x;
        this.y = previousPosition.y;
    }

    takeDamage(damage) {
        if (this.isDefeated) {
            return;
        }

        this.health = Math.max(0, this.health - damage);
        this.lastDamageTime = GAME_CLOCK.now();
        this.updateDefeatedState();
    }

    updateDefeatedState() {
        if (this.health > 0 || this.isDefeated) {
            return;
        }

        this.isDefeated = true;
        this.clearExpiredPoison();
        this.playAnimation('dead', 140, false);
    }

    applyPoison(damagePerTick, duration, tickInterval) {
        if (this.isDefeated) {
            return;
        }

        this.poisonDamagePerTick = damagePerTick;
        this.poisonEndTime = GAME_CLOCK.now() + duration;
        this.poisonTickInterval = tickInterval;
        this.nextPoisonTickTime = GAME_CLOCK.now() + tickInterval;
    }

    updatePoisonStatus() {
        if (!this.isPoisoned()) {
            this.clearExpiredPoison();
            return;
        }

        this.applyPoisonTickIfNeeded();
    }

    applyPoisonTickIfNeeded() {
        if (GAME_CLOCK.now() >= this.nextPoisonTickTime) {
            this.takeDamage(this.poisonDamagePerTick);
            this.nextPoisonTickTime = GAME_CLOCK.now() +
                this.poisonTickInterval;
        }
    }

    isPoisoned() {
        return GAME_CLOCK.now() < this.poisonEndTime &&
            this.poisonDamagePerTick > 0;
    }

    clearExpiredPoison() {
        this.poisonDamagePerTick = 0;
    }

    /** Returns whether the short damage feedback is active. */
    isHurt() {
        return GAME_CLOCK.now() - this.lastDamageTime <
            GAME_CONFIG.enemyHurtDuration;
    }

    trap(duration) {
        if (this.canBeTrapped()) {
            this.trappedUntil = GAME_CLOCK.now() + duration;
        }
    }

    canBeTrapped() {
        return !this.isDefeated;
    }

    isTrapped() {
        return GAME_CLOCK.now() < this.trappedUntil;
    }

    canDealContactDamage() {
        return !this.isDefeated && !this.isTrapped();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.lastDamageTime = 0;
        this.trappedUntil = 0;
        this.clearExpiredPoison();
        this.movementController.reset();
        this.isInflated = false;
        this.isTransitioning = false;
        this.damage = this.baseDamage;
        this.playAnimation('swim', GAME_CONFIG.pufferSwimFrameDuration);
    }

    draw(context) {
        if (this.isDefeated && this.isAnimationFinished()) {
            return;
        }

        this.drawEnemy(context);

        if (!this.isDefeated) {
            this.drawStatusIndicators(context);
        }
    }

    drawEnemy(context) {
        if (this.isImageReady()) {
            this.drawEnemyImage(context);
            return;
        }

        super.draw(context);
        this.drawFallbackDetails(context);
    }

    drawEnemyImage(context) {
        if (this.movementController.shouldMirrorSprite()) {
            this.drawMirroredEnemyImage(context);
            return;
        }

        this.drawImage(context);
    }

    drawMirroredEnemyImage(context) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
        context.restore();
    }

    drawFallbackDetails(context) {
        this.drawEnemyEye(context);
        this.drawEnemyTentacles(context);
    }

    drawEnemyEye(context) {
        context.fillStyle = this.eyeColor;
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + 18, 6, 0, Math.PI * 2);
        context.fill();
    }

    drawEnemyTentacles(context) {
        context.strokeStyle = this.fallbackColor;
        context.lineWidth = 4;
        this.drawTentacle(context, 14);
        this.drawTentacle(context, 29);
        this.drawTentacle(context, 44);
    }

    drawTentacle(context, offsetX) {
        context.beginPath();
        context.moveTo(this.x + offsetX, this.y + this.height - 8);
        context.lineTo(this.x + offsetX - 6, this.y + this.height + 18);
        context.stroke();
    }

    drawStatusIndicators(context) {
        this.drawHurtIndicator(context);
        this.drawTrapIndicator(context);
        this.drawPoisonIndicator(context);
    }

    /** Draws short visual feedback after receiving damage. */
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

        context.strokeStyle = 'rgba(169, 236, 255, 0.9)';
        context.lineWidth = 4;
        context.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }

    drawPoisonIndicator(context) {
        if (!this.isPoisoned()) {
            return;
        }

        context.strokeStyle = '#9dff57';
        context.lineWidth = 3;
        context.strokeRect(this.x - 9, this.y - 9, this.width + 18, this.height + 18);
    }
}