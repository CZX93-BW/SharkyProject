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
        this.speed =
            config.speed || GAME_CONFIG.enemySpeed;
        this.range =
            config.range || GAME_CONFIG.enemyPatrolRange;
        this.axis =
            config.axis || 'horizontal';
        this.damage =
            config.damage ||
            GAME_CONFIG.playerDamageFromEnemy;
        this.maxHealth =
            config.health || GAME_CONFIG.enemyHealth;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.trappedUntil = 0;
        this.poisonDamagePerTick = 0;
        this.poisonEndTime = 0;
        this.nextPoisonTickTime = 0;
        this.poisonTickInterval = 0;
        this.fallbackColor =
            config.fallbackColor ||
            GAME_CONFIG.enemyFallbackColor;
        this.eyeColor = GAME_CONFIG.enemyEyeColor;
        this.patrolDirection = 1;

        this.prepareAnimations();

        this.loadImage(
            config.imagePath ||
            this.getDefaultImagePath()
        );

        this.playAnimation('swim', 130);
    }

    /** Registers animations belonging to the enemy type. */
    prepareAnimations() {
        const enemyAssets = this.getEnemyAssets();

        this.addAnimation(
            'swim',
            enemyAssets.swim
        );
    }

    /** Returns configured assets or the Pufferfish fallback. */
    getEnemyAssets() {
        return ASSET_CONFIG.enemies[this.type] ||
            ASSET_CONFIG.enemies.pufferFish;
    }

    /** Returns the first frame used before animation begins. */
    getDefaultImagePath() {
        const enemyAssets = this.getEnemyAssets();

        return enemyAssets.swim[0] ||
            ASSET_CONFIG.enemies.default;
    }

    update() {
        if (this.isDefeated) {
            return;
        }

        this.updatePoisonStatus();
        this.playAnimation('swim', 130);

        if (this.isTrapped()) {
            return;
        }

        this.updatePatrol();
    }

    updatePatrol() {
        if (this.axis === 'vertical') {
            this.updateVerticalPatrol();
            return;
        }

        this.updateHorizontalPatrol();
    }

    updateHorizontalPatrol() {
        this.x +=
            this.speed * this.patrolDirection;

        this.changeDirectionAtHorizontalBounds();
        this.direction = this.patrolDirection;
    }

    updateVerticalPatrol() {
        this.y +=
            this.speed * this.patrolDirection;

        this.changeDirectionAtVerticalBounds();
    }

    changeDirectionAtHorizontalBounds() {
        const leftBoundary = this.startX;
        const rightBoundary =
            this.startX + this.range;

        if (
            this.x <= leftBoundary ||
            this.x >= rightBoundary
        ) {
            this.patrolDirection *= -1;
        }
    }

    changeDirectionAtVerticalBounds() {
        const upperBoundary = this.startY;
        const lowerBoundary =
            this.startY + this.range;

        if (
            this.y <= upperBoundary ||
            this.y >= lowerBoundary
        ) {
            this.patrolDirection *= -1;
        }
    }

    takeDamage(damage) {
        if (this.isDefeated) {
            return;
        }

        this.health = Math.max(
            0,
            this.health - damage
        );

        this.updateDefeatedState();
    }

    updateDefeatedState() {
        this.isDefeated = this.health <= 0;
    }

    applyPoison(
        damagePerTick,
        duration,
        tickInterval
    ) {
        if (this.isDefeated) {
            return;
        }

        this.poisonDamagePerTick = damagePerTick;
        this.poisonEndTime =
            Date.now() + duration;
        this.poisonTickInterval = tickInterval;
        this.nextPoisonTickTime =
            Date.now() + tickInterval;
    }

    updatePoisonStatus() {
        if (!this.isPoisoned()) {
            this.clearExpiredPoison();
            return;
        }

        this.applyPoisonTickIfNeeded();
    }

    applyPoisonTickIfNeeded() {
        if (Date.now() < this.nextPoisonTickTime) {
            return;
        }

        this.takeDamage(
            this.poisonDamagePerTick
        );

        this.nextPoisonTickTime =
            Date.now() + this.poisonTickInterval;
    }

    isPoisoned() {
        return Date.now() < this.poisonEndTime &&
            this.poisonDamagePerTick > 0;
    }

    clearExpiredPoison() {
        this.poisonDamagePerTick = 0;
    }

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
        return Date.now() < this.trappedUntil;
    }

    canDealContactDamage() {
        return !this.isDefeated &&
            !this.isTrapped();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.trappedUntil = 0;
        this.clearExpiredPoison();
        this.patrolDirection = 1;
        this.direction = 1;
        this.playAnimation('swim', 130);
    }

    draw(context) {
        if (this.isDefeated) {
            return;
        }

        this.drawEnemy(context);
        this.drawStatusIndicators(context);
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
        if (this.direction === -1) {
            this.drawMirroredEnemyImage(context);
            return;
        }

        this.drawImage(context);
    }

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
        context.strokeStyle = this.fallbackColor;
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
        this.drawTrapIndicator(context);
        this.drawPoisonIndicator(context);
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