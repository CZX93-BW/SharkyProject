'use strict';

class Character extends AnimatedDrawableObject {
    /** Creates Sharky and prepares the character animations. */
    constructor() {
        super(
            GAME_CONFIG.playerStartX,
            GAME_CONFIG.playerStartY,
            GAME_CONFIG.playerWidth,
            GAME_CONFIG.playerHeight
        );

        this.speed = GAME_CONFIG.playerSpeed;
        this.maxHealth = GAME_CONFIG.playerHealth;
        this.health = this.maxHealth;
        this.lastDamageTime = 0;
        this.fallbackColor = GAME_CONFIG.playerFallbackColor;
        this.eyeColor = GAME_CONFIG.playerEyeColor;
        this.name = 'Sharky';
        this.isFinSlapping = false;
        this.spriteSource = this.createSpriteSource();

        this.prepareAnimations();
    }

    /** Returns the shared source area used by Sharky's frames. */
    createSpriteSource() {
        return {
            x: 145,
            y: 440,
            width: 535,
            height: 440
        };
    }

    /** Registers Sharky's currently supported image sequences. */
    prepareAnimations() {
        this.addAnimation(
            'idle',
            ASSET_CONFIG.character.idle
        );

        this.addAnimation(
            'swim',
            ASSET_CONFIG.character.swim
        );

        this.addAnimation(
            'finSlap',
            ASSET_CONFIG.character.finSlap
        );

        this.addAnimation(
            'hurt',
            ASSET_CONFIG.character.hurt
        );

        this.addAnimation(
            'dead',
            ASSET_CONFIG.character.dead
        );

        this.loadImage(ASSET_CONFIG.character.sharky);
        this.playAnimation('idle', 160);
    }

    /** Updates movement and selects the matching animation. */
    update(keyboard, bounds) {
        this.resetVelocity();
        this.applyKeyboardMovement(keyboard);
        this.normalizeDiagonalMovement();
        this.updatePosition();
        this.keepInsideBounds(bounds);
        this.updateAnimation();
    }

    /** Selects the animation according to its gameplay priority. */
    updateAnimation() {
        if (!this.isAlive()) {
            this.playAnimation('dead', 130, false);
            return;
        }

        if (this.isInvulnerable()) {
            this.playAnimation('hurt', 110, false);
            return;
        }

        if (this.isFinSlapping) {
            this.updateFinSlapAnimation();
            return;
        }

        if (this.isMoving()) {
            this.playAnimation('swim', 100);
            return;
        }

        this.playAnimation('idle', 160);
    }

    /** Starts the one-time Fin Slap character animation. */
    startFinSlap() {
        if (!this.isAlive()) {
            return;
        }

        this.isFinSlapping = true;
        this.playAnimation('finSlap', 60, false);
    }

    /** Advances Fin Slap and releases it after the last frame. */
    updateFinSlapAnimation() {
        this.playAnimation('finSlap', 60, false);

        if (this.isAnimationFinished()) {
            this.isFinSlapping = false;
        }
    }

    /** Returns whether Sharky currently has movement velocity. */
    isMoving() {
        return this.velocityX !== 0 ||
            this.velocityY !== 0;
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

        this.velocityX *=
            GAME_CONFIG.diagonalMovementFactor;

        this.velocityY *=
            GAME_CONFIG.diagonalMovementFactor;
    }

    hasDiagonalVelocity() {
        return this.velocityX !== 0 &&
            this.velocityY !== 0;
    }

    increaseSpeed(amount) {
        this.speed += amount;
    }

    setMaxHealth(maxHealth) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }

    takeDamage(damage) {
        if (!this.canTakeDamage()) {
            return;
        }

        this.health = Math.max(
            0,
            this.health - damage
        );

        this.lastDamageTime = Date.now();
    }

    canTakeDamage() {
        return this.isAlive() &&
            !this.isInvulnerable();
    }

    isAlive() {
        return this.health > 0;
    }

    isInvulnerable() {
        const timeSinceDamage =
            Date.now() - this.lastDamageTime;

        return timeSinceDamage <
            GAME_CONFIG.playerInvulnerabilityDuration;
    }

    draw(context) {
        if (this.isImageReady()) {
            this.drawCharacterImage(context);
            this.drawDamageIndicator(context);
            return;
        }

        super.draw(context);
        this.drawFallbackDetails(context);
    }

    drawCharacterImage(context) {
        if (this.direction === -1) {
            this.drawMirroredImage(context);
            return;
        }

        this.drawSpriteFrame(context, this.x);
    }

    drawMirroredImage(context) {
        context.save();
        context.scale(-1, 1);

        this.drawSpriteFrame(
            context,
            -this.x - this.width
        );

        context.restore();
    }

    /** Draws only the relevant source area of the large Sharky frame. */
    drawSpriteFrame(context, destinationX) {
        const source = this.spriteSource;

        context.drawImage(
            this.image,
            source.x,
            source.y,
            source.width,
            source.height,
            destinationX,
            this.y,
            this.width,
            this.height
        );
    }

    drawFallbackDetails(context) {
        this.drawTail(context);
        this.drawEye(context);
        this.drawDamageIndicator(context);
    }

    drawTail(context) {
        context.fillStyle = this.fallbackColor;
        context.beginPath();

        context.moveTo(
            this.x,
            this.y + this.height / 2
        );

        context.lineTo(
            this.x - 22,
            this.y + 8
        );

        context.lineTo(
            this.x - 22,
            this.y + this.height - 8
        );

        context.closePath();
        context.fill();
    }

    drawEye(context) {
        const eyeX = this.getEyeX();
        const eyeY = this.y + 15;

        context.fillStyle = this.eyeColor;
        context.beginPath();

        context.arc(
            eyeX,
            eyeY,
            5,
            0,
            Math.PI * 2
        );

        context.fill();
    }

    drawDamageIndicator(context) {
        if (!this.isInvulnerable()) {
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

    getEyeX() {
        if (this.direction === 1) {
            return this.x + this.width - 20;
        }

        return this.x + 20;
    }
}