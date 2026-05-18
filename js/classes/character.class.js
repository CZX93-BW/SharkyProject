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
        this.fallbackColor = GAME_CONFIG.playerFallbackColor;
        this.eyeColor = GAME_CONFIG.playerEyeColor;
        this.name = 'Sharky';
    }

    update(keyboard, bounds) {
        this.resetVelocity();
        this.applyKeyboardMovement(keyboard);
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

    draw(context) {
        super.draw(context);

        if (!this.isImageReady()) {
            this.drawFallbackDetails(context);
        }
    }

    drawFallbackDetails(context) {
        this.drawTail(context);
        this.drawEye(context);
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

    getEyeX() {
        if (this.direction === 1) {
            return this.x + this.width - 20;
        }

        return this.x + 20;
    }
}