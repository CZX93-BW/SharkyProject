'use strict';

class Enemy extends MovableObject {
    constructor(config = {}) {
        super(
            config.x,
            config.y,
            config.width || GAME_CONFIG.enemyWidth,
            config.height || GAME_CONFIG.enemyHeight
        );

        this.startX = this.x;
        this.startY = this.y;
        this.speed = config.speed || GAME_CONFIG.enemySpeed;
        this.range = config.range || GAME_CONFIG.enemyPatrolRange;
        this.axis = config.axis || 'horizontal';
        this.damage = config.damage || GAME_CONFIG.playerDamageFromEnemy;
        this.maxHealth = config.health || GAME_CONFIG.enemyHealth;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.trappedUntil = 0;
        this.poisonDamagePerTick = 0;
        this.poisonEndTime = 0;
        this.nextPoisonTickTime = 0;
        this.poisonTickInterval = 0;
        this.fallbackColor = config.fallbackColor || GAME_CONFIG.enemyFallbackColor;
        this.eyeColor = GAME_CONFIG.enemyEyeColor;
        this.patrolDirection = 1;
    }

    update() {
        if (this.isDefeated) {
            return;
        }

        this.updatePoisonStatus();

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
        this.x += this.speed * this.patrolDirection;
        this.changeDirectionAtHorizontalBounds();
        this.direction = this.patrolDirection;
    }

    updateVerticalPatrol() {
        this.y += this.speed * this.patrolDirection;
        this.changeDirectionAtVerticalBounds();
    }

    changeDirectionAtHorizontalBounds() {
        if (this.x <= this.startX || this.x >= this.startX + this.range) {
            this.patrolDirection *= -1;
        }
    }

    changeDirectionAtVerticalBounds() {
        if (this.y <= this.startY || this.y >= this.startY + this.range) {
            this.patrolDirection *= -1;
        }
    }

    takeDamage(damage) {
        if (this.isDefeated) {
            return;
        }

        this.health = Math.max(0, this.health - damage);
        this.updateDefeatedState();
    }

    updateDefeatedState() {
        this.isDefeated = this.health <= 0;
    }

    applyPoison(damagePerTick, duration, tickInterval) {
        if (this.isDefeated) {
            return;
        }

        this.poisonDamagePerTick = damagePerTick;
        this.poisonEndTime = Date.now() + duration;
        this.poisonTickInterval = tickInterval;
        this.nextPoisonTickTime = Date.now() + tickInterval;
    }

    updatePoisonStatus() {
        if (!this.isPoisoned()) {
            this.clearExpiredPoison();
            return;
        }

        this.applyPoisonTickIfNeeded();
    }

    applyPoisonTickIfNeeded() {
        if (Date.now() >= this.nextPoisonTickTime) {
            this.takeDamage(this.poisonDamagePerTick);
            this.nextPoisonTickTime = Date.now() + this.poisonTickInterval;
        }
    }

    isPoisoned() {
        return Date.now() < this.poisonEndTime && this.poisonDamagePerTick > 0;
    }

    clearExpiredPoison() {
        this.poisonDamagePerTick = 0;
    }

    trap(duration) {
        if (this.canBeTrapped()) {
            this.trappedUntil = Date.now() + duration;
        }
    }

    canBeTrapped() {
        return !this.isDefeated;
    }

    isTrapped() {
        return Date.now() < this.trappedUntil;
    }

    canDealContactDamage() {
        return !this.isDefeated && !this.isTrapped();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.trappedUntil = 0;
        this.clearExpiredPoison();
        this.patrolDirection = 1;
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
            this.drawImage(context);
            return;
        }

        super.draw(context);
        this.drawFallbackDetails(context);
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
        this.drawTrapIndicator(context);
        this.drawPoisonIndicator(context);
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