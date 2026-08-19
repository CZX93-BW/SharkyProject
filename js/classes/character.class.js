'use strict';

class Character extends AnimatedDrawableObject {
    /** Creates Sharky and prepares the first character animations. */
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
        this.activeAttackAnimation = '';
        this.spriteSources = this.createSpriteSources();
        this.prepareAnimations();
    }

    /** Returns the shared source area used by idle and swim frames. */
    createSpriteSources() {
        return {
            default: {
                x: 145,
                y: 440,
                width: 535,
                height: 440
            },
            finSlap: {
                x: 145,
                y: 230,
                width: 670,
                height: 690
            },
            bubbleTrap: {
                x: 70,
                y: 350,
                width: 680,
                height: 430
            }
        };
    }

    /** Registers Sharky's currently supported image sequences. */
    prepareAnimations() {
        this.addAnimation('idle', ASSET_CONFIG.character.idle);
        this.addAnimation('swim', ASSET_CONFIG.character.swim);
        this.addAnimation('finSlap', ASSET_CONFIG.character.finSlap);
        this.addAnimation('bubbleTrap', ASSET_CONFIG.character.bubbleTrap);
        this.addAnimation('hurt', ASSET_CONFIG.character.hurt);
        this.addAnimation('dead', ASSET_CONFIG.character.dead);
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

    /** Selects swim while moving and idle while standing still. */
    updateAnimation() {
        if (!this.isAlive()) {
            this.playAnimation('dead', 130, false);
            return;
        }

        if (this.isInvulnerable()) {
            this.playAnimation('hurt', 110, false);
            return;
        }

        if (this.activeAttackAnimation) {
            this.updateAttackAnimation();
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

        this.startAttackAnimation('finSlap');
    }

    /** Starts the one-time Bubble Trap character animation. */
    startBubbleTrap() {
        if (!this.isAlive()) {
            return;
        }

        this.startAttackAnimation('bubbleTrap');
    }

    /** Starts the shared bubble animation for a Poison Shot. */
    startPoisonShot() {
        if (!this.isAlive()) {
            return;
        }

        this.startAttackAnimation('bubbleTrap');
    }

    /** Starts a supported one-time character attack animation. */
    startAttackAnimation(animationName) {
        this.activeAttackAnimation = animationName;
        this.playAnimation(animationName, 60, false);
    }

    /** Advances the active attack and releases it after its last frame. */
    updateAttackAnimation() {
        this.playAnimation(this.activeAttackAnimation, 60, false);

        if (this.isAnimationFinished()) {
            this.activeAttackAnimation = '';
        }
    }

    /** Returns whether Sharky currently has movement velocity. */
    isMoving() {
        return this.velocityX !== 0 || this.velocityY !== 0;
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

        this.health = Math.max(0, this.health - damage);
        this.lastDamageTime = GAME_CLOCK.now();
    }

    canTakeDamage() {
        return this.isAlive() && !this.isInvulnerable();
    }

    isAlive() {
        return this.health > 0;
    }

    isInvulnerable() {
        return GAME_CLOCK.now() - this.lastDamageTime <
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
        const renderArea = this.getSpriteRenderArea();

        if (this.direction === -1) {
            this.drawMirroredImage(context, renderArea);
            return;
        }

        this.drawSpriteFrame(context, renderArea);
    }

    drawMirroredImage(context, renderArea) {
        context.save();
        context.scale(-1, 1);

        const mirroredArea = {
            ...renderArea,
            x: -renderArea.x - renderArea.width
        };

        this.drawSpriteFrame(context, mirroredArea);
        context.restore();
    }

    /** Returns the source rectangle for the current animation. */
    getCurrentSpriteSource() {
        return this.spriteSources[this.currentAnimation] ||
            this.spriteSources.default;
    }

    /** Returns a visual area without changing Sharky's hitbox. */
    getSpriteRenderArea() {
        if (this.currentAnimation === 'finSlap') {
            return {
                x: this.x - 21,
                y: this.y - 26,
                width: 120,
                height: 100
            };
        }

        if (this.currentAnimation === 'bubbleTrap') {
            return {
                x: this.x - 16,
                y: this.y - 11,
                width: 110,
                height: 70
            };
        }

        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /** Draws the selected source rectangle into its visual area. */
    drawSpriteFrame(context, renderArea) {
        const source = this.getCurrentSpriteSource();

        context.drawImage(
            this.image,
            source.x,
            source.y,
            source.width,
            source.height,
            renderArea.x,
            renderArea.y,
            renderArea.width,
            renderArea.height
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