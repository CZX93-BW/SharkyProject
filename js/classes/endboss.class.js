'use strict';

class Endboss extends Enemy {
    constructor(config = {}) {
        super({
            x: config.x,
            y: config.y,
            width: GAME_CONFIG.endbossWidth,
            height: GAME_CONFIG.endbossHeight,
            speed: config.speed || GAME_CONFIG.endbossSpeed,
            range: config.range || GAME_CONFIG.endbossPatrolRange,
            axis: config.axis || 'vertical',
            damage: GAME_CONFIG.endbossDamage,
            fallbackColor: GAME_CONFIG.endbossFallbackColor
        });

        this.health = GAME_CONFIG.endbossHealth;
        this.maxHealth = GAME_CONFIG.endbossHealth;
        this.eyeColor = GAME_CONFIG.endbossEyeColor;
        this.isDefeated = false;
        this.loadImage(ASSET_CONFIG.enemies.endboss);
    }

    update() {
        if (this.isDefeated) {
            return;
        }

        super.update();
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

    reset() {
        super.reset();
        this.health = this.maxHealth;
        this.isDefeated = false;
    }

    draw(context) {
        if (this.isDefeated) {
            return;
        }

        this.drawBody(context);
        this.drawFace(context);
        this.drawFins(context);
        this.drawHealthBar(context);
    }

    drawBody(context) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    drawFace(context) {
        context.fillStyle = this.eyeColor;
        context.beginPath();
        context.arc(this.x + 105, this.y + 34, 9, 0, Math.PI * 2);
        context.fill();
    }

    drawFins(context) {
        context.fillStyle = this.fallbackColor;
        this.drawTopFin(context);
        this.drawTailFin(context);
    }

    drawTopFin(context) {
        context.beginPath();
        context.moveTo(this.x + 60, this.y);
        context.lineTo(this.x + 92, this.y - 36);
        context.lineTo(this.x + 108, this.y);
        context.closePath();
        context.fill();
    }

    drawTailFin(context) {
        context.beginPath();
        context.moveTo(this.x, this.y + 60);
        context.lineTo(this.x - 40, this.y + 24);
        context.lineTo(this.x - 40, this.y + 96);
        context.closePath();
        context.fill();
    }

    drawHealthBar(context) {
        context.fillStyle = '#1c0c24';
        context.fillRect(this.x, this.y - 18, this.width, 8);
        this.drawHealthBarValue(context);
    }

    drawHealthBarValue(context) {
        const currentWidth = this.width * (this.health / this.maxHealth);
        context.fillStyle = '#ffeb5c';
        context.fillRect(this.x, this.y - 18, currentWidth, 8);
    }
}