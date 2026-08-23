'use strict';

/**
 * Represents Sharky with movement, combat animation, health, and rendering
 * behavior controlled by the current keyboard state.
 *
 * @extends AnimatedDrawableObject
 */
class Character extends AnimatedDrawableObject {
    /** Creates Sharky at the configured start position. */
    constructor() {
        super(
            GAME_CONFIG.playerStartX,
            GAME_CONFIG.playerStartY,
            GAME_CONFIG.playerWidth,
            GAME_CONFIG.playerHeight
        );
        this.initializeCharacterState();
        this.spriteSources = this.createSpriteSources();
        this.prepareAnimations();
    }

    /** Initializes Sharky's combat, appearance, and animation state. */
    initializeCharacterState() {
        this.speed = GAME_CONFIG.playerSpeed;
        this.maxHealth = GAME_CONFIG.playerHealth;
        this.health = this.maxHealth;
        this.lastDamageTime = 0;
        this.fallbackColor = GAME_CONFIG.playerFallbackColor;
        this.eyeColor = GAME_CONFIG.playerEyeColor;
        this.name = 'Sharky';
        this.activeAttackAnimation = '';
    }

    /** @returns {Object} Source rectangles for every supported sprite layout. */
    createSpriteSources() {
        return {
            default: this.createSpriteSource(145, 440, 535, 440),
            finSlap: this.createSpriteSource(145, 230, 670, 690),
            bubbleTrap: this.createSpriteSource(70, 350, 680, 430)
        };
    }

    /**
     * @param {number} x - Horizontal source position.
     * @param {number} y - Vertical source position.
     * @param {number} width - Source width.
     * @param {number} height - Source height.
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    createSpriteSource(x, y, width, height) {
        return { x, y, width, height };
    }

    /** Registers all supported Sharky animation sequences. */
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

    /**
     * Updates movement and animation for one game frame.
     *
     * @param {Keyboard} keyboard - Current input state.
     * @param {Object} bounds - Movement boundaries.
     */
    update(keyboard, bounds) {
        this.resetVelocity();
        this.applyKeyboardMovement(keyboard);
        this.normalizeDiagonalMovement();
        this.updatePosition();
        this.keepInsideBounds(bounds);
        this.updateAnimation();
    }

    /** Selects the animation with the highest active priority. */
    updateAnimation() {
        if (this.updateCriticalAnimation()) {
            return;
        }
        if (this.activeAttackAnimation) {
            this.updateAttackAnimation();
            return;
        }
        const movementAnimation = this.isMoving() ? 'swim' : 'idle';
        const frameDuration = this.isMoving() ? 100 : 160;
        this.playAnimation(movementAnimation, frameDuration);
    }

    /** @returns {boolean} Whether a dead or hurt animation was selected. */
    updateCriticalAnimation() {
        if (!this.isAlive()) {
            this.playAnimation('dead', 130, false);
            return true;
        }
        if (this.isInvulnerable()) {
            this.playAnimation('hurt', 110, false);
            return true;
        }
        return false;
    }

    /** Starts the one-time Fin Slap character animation. */
    startFinSlap() {
        if (this.isAlive()) {
            this.startAttackAnimation('finSlap');
        }
    }

    /** Starts the one-time Bubble Trap character animation. */
    startBubbleTrap() {
        if (this.isAlive()) {
            this.startAttackAnimation('bubbleTrap');
        }
    }

    /** Starts the bubble animation shared by the Poison Shot. */
    startPoisonShot() {
        if (this.isAlive()) {
            this.startAttackAnimation('bubbleTrap');
        }
    }

    /** @param {string} animationName - Registered attack animation name. */
    startAttackAnimation(animationName) {
        this.activeAttackAnimation = animationName;
        this.playAnimation(animationName, 60, false);
    }

    /** Advances and clears the active one-time attack animation. */
    updateAttackAnimation() {
        this.playAnimation(this.activeAttackAnimation, 60, false);
        if (this.isAnimationFinished()) {
            this.activeAttackAnimation = '';
        }
    }

    /** @returns {boolean} Whether Sharky currently has movement velocity. */
    isMoving() {
        return this.velocityX !== 0 || this.velocityY !== 0;
    }

    /** Clears horizontal and vertical movement velocity. */
    resetVelocity() {
        this.velocityX = 0;
        this.velocityY = 0;
    }

    /** @param {Keyboard} keyboard - Current input state. */
    applyKeyboardMovement(keyboard) {
        this.handleHorizontalInput(keyboard);
        this.handleVerticalInput(keyboard);
    }

    /** @param {Keyboard} keyboard - Current input state. */
    handleHorizontalInput(keyboard) {
        if (keyboard.isMovingLeft()) {
            this.moveLeft();
        }
        if (keyboard.isMovingRight()) {
            this.moveRight();
        }
    }

    /** @param {Keyboard} keyboard - Current input state. */
    handleVerticalInput(keyboard) {
        if (keyboard.isMovingUp()) {
            this.moveUp();
        }
        if (keyboard.isMovingDown()) {
            this.moveDown();
        }
    }

    /** Normalizes diagonal velocity to prevent faster diagonal movement. */
    normalizeDiagonalMovement() {
        if (!this.hasDiagonalVelocity()) {
            return;
        }
        this.velocityX *= GAME_CONFIG.diagonalMovementFactor;
        this.velocityY *= GAME_CONFIG.diagonalMovementFactor;
    }

    /** @returns {boolean} Whether both movement axes are active. */
    hasDiagonalVelocity() {
        return this.velocityX !== 0 && this.velocityY !== 0;
    }

    /** @param {number} amount - Speed increase to apply. */
    increaseSpeed(amount) {
        this.speed += amount;
    }

    /** @param {number} maxHealth - New maximum and current health value. */
    setMaxHealth(maxHealth) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }

    /** @param {number} damage - Damage points to subtract. */
    takeDamage(damage) {
        if (!this.canTakeDamage()) {
            return;
        }
        this.health = Math.max(0, this.health - damage);
        this.lastDamageTime = GAME_CLOCK.now();
    }

    /** @returns {boolean} Whether Sharky can currently receive damage. */
    canTakeDamage() {
        return this.isAlive() && !this.isInvulnerable();
    }

    /** @returns {boolean} Whether Sharky has remaining health. */
    isAlive() {
        return this.health > 0;
    }

    /** @returns {boolean} Whether damage invulnerability is active. */
    isInvulnerable() {
        return GAME_CLOCK.now() - this.lastDamageTime <
            GAME_CONFIG.playerInvulnerabilityDuration;
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    draw(context) {
        if (this.isImageReady()) {
            this.drawCharacterImage(context);
            this.drawDamageIndicator(context);
            return;
        }
        super.draw(context);
        this.drawFallbackDetails(context);
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawCharacterImage(context) {
        const renderArea = this.getSpriteRenderArea();
        if (this.direction === -1) {
            this.drawMirroredImage(context, renderArea);
            return;
        }
        this.drawSpriteFrame(context, renderArea);
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Object} renderArea - Target area for the current sprite.
     */
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

    /** @returns {Object} Source rectangle for the current animation. */
    getCurrentSpriteSource() {
        return this.spriteSources[this.currentAnimation] ||
            this.spriteSources.default;
    }

    /** @returns {Object} Visual render area without changing the hitbox. */
    getSpriteRenderArea() {
        if (this.currentAnimation === 'finSlap') {
            return this.createSpriteRenderArea(-21, -26, 120, 100);
        }
        if (this.currentAnimation === 'bubbleTrap') {
            return this.createSpriteRenderArea(-16, -11, 110, 70);
        }
        return this.createSpriteRenderArea(0, 0, this.width, this.height);
    }

    /**
     * @param {number} offsetX - Horizontal position offset.
     * @param {number} offsetY - Vertical position offset.
     * @param {number} width - Rendered width.
     * @param {number} height - Rendered height.
     * @returns {Object} Sprite target area.
     */
    createSpriteRenderArea(offsetX, offsetY, width, height) {
        return {
            x: this.x + offsetX,
            y: this.y + offsetY,
            width,
            height
        };
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Object} renderArea - Target area for the current sprite.
     */
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

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawFallbackDetails(context) {
        this.drawTail(context);
        this.drawEye(context);
        this.drawDamageIndicator(context);
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawTail(context) {
        context.fillStyle = this.fallbackColor;
        context.beginPath();
        context.moveTo(this.x, this.y + this.height / 2);
        context.lineTo(this.x - 22, this.y + 8);
        context.lineTo(this.x - 22, this.y + this.height - 8);
        context.closePath();
        context.fill();
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawEye(context) {
        const eyeX = this.getEyeX();
        const eyeY = this.y + 15;
        context.fillStyle = this.eyeColor;
        context.beginPath();
        context.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
        context.fill();
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
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

    /** @returns {number} Horizontal eye position for the facing direction. */
    getEyeX() {
        if (this.direction === 1) {
            return this.x + this.width - 20;
        }
        return this.x + 20;
    }
}