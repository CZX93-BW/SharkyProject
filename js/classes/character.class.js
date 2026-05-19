'use strict';

class Character extends MovableObject {
    constructor() {
        super(
            GAME_CONFIG.playerStartX,
            GAME_CONFIG.playerStartY,
            GAME_CONFIG.playerWidth,
            GAME_CONFIG.playerHeight
        );

        this.speed = GAME_CONFIG.playerSpeed;
        this.health = GAME_CONFIG.playerHealth;
        this.lastDamageTime = 0;
        this.fallbackColor = GAME_CONFIG.playerFallbackColor;
        this.eyeColor = GAME_CONFIG.playerEyeColor;
        this.name = 'Sharky';
    }

    update(keyboard, bounds) {
        this.resetVelocity();
        this.applyKeyboardMovement(keyboard);
        this.normalizeDiagonalMovement();
        this.updatePosition();
        this.keepInsideBounds(bounds);
    }

    resetVelocity() {
        this.velocityX = 0;
        this.velocityY = 0;
    }

    applyKeyboardMovement(keyboard) {
        this.handleHorizontalInput(keyboard);
        this.handleVerticalInput(keyboard);
    }

    handleHorizontalInput(keyboard) {
        if (keyboard.isMovingLeft()) {
            this.moveLeft();
        }

        if (keyboard.isMovingRight()) {
            this.moveRight();
        }
    }

    handleVerticalInput(keyboard) {
        if (keyboard.isMovingUp()) {
            this.moveUp();
        }

        if (keyboard.isMovingDown()) {
            this.moveDown();
        }
    }

    normalizeDiagonalMovement() {
        if (!this.hasDiagonalVelocity()) {
            return;
        }

        this.velocityX *= GAME_CONFIG.diagonalMovementFactor;
        this.velocityY *= GAME_CONFIG.diagonalMovementFactor;
    }

    hasDiagonalVelocity() {
        return this.velocityX !== 0 && this.velocityY !== 0;
    }

    takeDamage(damage) {
        if (!this.canTakeDamage()) {
            return;
        }

        this.health = Math.max(0, this.health - damage);
        this.lastDamageTime = Date.now();
    }

    canTakeDamage() {
        return this.isAlive() && !this.isInvulnerable();
    }

    isAlive() {
        return this.health > 0;
    }

    isInvulnerable() {
        return Date.now() - this.lastDamageTime < GAME_CONFIG.playerInvulnerabilityDuration;
    }

    draw(context) {
        super.draw(context);

        if (!this.isImageReady()) {
            this.drawFallbackDetails(context);
        }
    }

    drawFallbackDetails(context) {
        this.drawTail(context);
        this.drawEye(context);
        this.drawDamageIndicator(context);
    }

    drawTail(context) {
        context.fillStyle = this.fallbackColor;
        context.beginPath();
        context.moveTo(this.x, this.y + this.height / 2);
        context.lineTo(this.x - 22, this.y + 8);
        context.lineTo(this.x - 22, this.y + this.height - 8);
        context.closePath();
        context.fill();
    }

    drawEye(context) {
        const eyeX = this.getEyeX();
        const eyeY = this.y + 15;

        context.fillStyle = this.eyeColor;
        context.beginPath();
        context.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
        context.fill();
    }

    drawDamageIndicator(context) {
        if (!this.isInvulnerable()) {
            return;
        }

        context.strokeStyle = '#ffffff';
        context.lineWidth = 3;
        context.strokeRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
    }

    getEyeX() {
        if (this.direction === 1) {
            return this.x + this.width - 20;
        }

        return this.x + 20;
    }
}