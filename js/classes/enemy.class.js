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
        this.fallbackColor = config.fallbackColor || GAME_CONFIG.enemyFallbackColor;
        this.eyeColor = GAME_CONFIG.enemyEyeColor;
        this.patrolDirection = 1;
    }

    update() {
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

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.patrolDirection = 1;
    }

    draw(context) {
        super.draw(context);

        if (!this.isImageReady()) {
            this.drawFallbackDetails(context);
        }
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
}