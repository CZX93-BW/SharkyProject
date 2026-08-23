'use strict';
/**
 * Represents an animated enemy with movement, combat, status, and rendering
 * behavior shared by regular enemies and the end boss.
 *
 * @extends AnimatedDrawableObject
 */
class Enemy extends AnimatedDrawableObject {
    /**
     * Creates an enemy from its spawn and behavior configuration.
     *
     * @param {Object} [config={}] - Enemy configuration.
     */
    constructor(config = {}) {
        super(
            config.x, config.y,
            config.width || GAME_CONFIG.enemyWidth,
            config.height || GAME_CONFIG.enemyHeight
        );
        this.startX = this.x;
        this.startY = this.y;
        this.configureCombat(config);
        this.initializeStatusEffects();
        this.configureAppearance(config);
        this.initializeEnemyMovement(config);
        this.prepareAnimations();
        this.loadImage(config.imagePath || this.getDefaultImagePath());
        this.playAnimation('swim', 130);
    }
    /** @param {Object} config - Enemy combat configuration. */
    configureCombat(config) {
        this.type = config.type || 'pufferFish';
        this.damage = config.damage || GAME_CONFIG.playerDamageFromEnemy;
        this.baseDamage = this.damage;
        this.maxHealth = config.health || GAME_CONFIG.enemyHealth;
        this.health = this.maxHealth;
        this.isDefeated = false;
        this.lastDamageTime = 0;
    }
    /** Initializes temporary status-effect values. */
    initializeStatusEffects() {
        this.trappedUntil = 0;
        this.poisonDamagePerTick = 0;
        this.poisonEndTime = 0;
        this.nextPoisonTickTime = 0;
        this.poisonTickInterval = 0;
    }
    /** @param {Object} config - Enemy appearance configuration. */
    configureAppearance(config) {
        this.fallbackColor = config.fallbackColor || GAME_CONFIG.enemyFallbackColor;
        this.eyeColor = GAME_CONFIG.enemyEyeColor;
    }
    /** @param {Object} config - Enemy movement configuration. */
    initializeEnemyMovement(config) {
        this.isInflated = false;
        this.isTransitioning = false;
        this.movementController = new EnemyMovementController(
            this,
            config.movement
        );
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
    /** @returns {Object} Asset group for the configured enemy type. */
    getEnemyAssets() {
        return ASSET_CONFIG.enemies[this.type] ||
            ASSET_CONFIG.enemies.pufferFish;
    }
    /** @returns {string} Initial image path used before animation starts. */
    getDefaultImagePath() {
        return this.getEnemyAssets().swim[0] ||
            ASSET_CONFIG.enemies.default;
    }
    /**
     * Updates combat effects, animation, and movement for one game frame.
     *
     * @param {Array<DrawableObject>} [solidAreas=[]] - Blocking world objects.
     * @param {Character|null} [player=null] - Current player instance.
     */
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
    /** @param {Character|null} player - Current player instance. */
    updateAnimationState(player) {
        if (this.type !== 'pufferFish') {
            this.playPufferAnimation('swim');
            return;
        }
        this.updatePufferAnimation(player);
    }
    /** @param {Character|null} player - Current player instance. */
    updatePufferAnimation(player) {
        if (this.isTransitioning) {
            this.updatePufferTransition();
            return;
        }
        if (this.isInflated) {
            this.playPufferAnimation('inflatedSwim');
            return;
        }
        this.updateCalmPufferAnimation(player);
    }
    /** @param {Character|null} player - Current player instance. */
    updateCalmPufferAnimation(player) {
        if (this.isPlayerInsidePufferRange(player)) {
            this.startPufferTransition();
            return;
        }
        this.playPufferAnimation('swim');
    }
    /** @param {string} animationName - Registered pufferfish animation name. */
    playPufferAnimation(animationName) {
        this.playAnimation(
            animationName,
            GAME_CONFIG.pufferSwimFrameDuration
        );
    }
    /** Starts the pufferfish inflation transition. */
    startPufferTransition() {
        this.isTransitioning = true;
        this.playAnimation(
            'transition',
            GAME_CONFIG.pufferTransitionFrameDuration,
            false
        );
    }
    /** Advances the active pufferfish transition. */
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
    /** Activates the inflated pufferfish state. */
    finishPufferTransition() {
        this.isTransitioning = false;
        this.isInflated = true;
        this.damage = GAME_CONFIG.pufferInflatedDamage;
        this.playPufferAnimation('inflatedSwim');
    }
    /**
     * @param {Character|null} player - Current player instance.
     * @returns {boolean} Whether the player is inside the inflation range.
     */
    isPlayerInsidePufferRange(player) {
        if (!player) {
            return false;
        }
        const horizontalDistance = player.x - this.x;
        const verticalDistance = player.y - this.y;
        return Math.hypot(horizontalDistance, verticalDistance) <=
            GAME_CONFIG.pufferActivationDistance;
    }
    /** @param {Array<DrawableObject>} solidAreas - Blocking world objects. */
    updateMovementWithSolidAreas(solidAreas) {
        const previousPosition = { x: this.x, y: this.y };
        this.movementController.update();
        if (this.isTouchingSolidArea(solidAreas)) {
            this.restorePosition(previousPosition);
            this.movementController.handleObstacle();
        }
    }
    /**
     * @param {Array<DrawableObject>} solidAreas - Blocking world objects.
     * @returns {boolean} Whether the enemy overlaps a solid object.
     */
    isTouchingSolidArea(solidAreas) {
        return solidAreas.some((solidArea) => {
            return this.x + this.width > solidArea.x &&
                this.x < solidArea.x + solidArea.width &&
                this.y + this.height > solidArea.y &&
                this.y < solidArea.y + solidArea.height;
        });
    }
    /** @param {{x: number, y: number}} previousPosition - Position to restore. */
    restorePosition(previousPosition) {
        this.x = previousPosition.x;
        this.y = previousPosition.y;
    }
    /** @param {number} damage - Damage points to subtract. */
    takeDamage(damage) {
        if (this.isDefeated) {
            return;
        }
        this.health = Math.max(0, this.health - damage);
        this.lastDamageTime = GAME_CLOCK.now();
        this.updateDefeatedState();
    }
    /** Marks the enemy as defeated when its health reaches zero. */
    updateDefeatedState() {
        if (this.health > 0 || this.isDefeated) {
            return;
        }
        this.isDefeated = true;
        this.clearExpiredPoison();
        this.playAnimation('dead', 140, false);
    }
    /**
     * @param {number} damagePerTick - Damage dealt by each poison tick.
     * @param {number} duration - Poison duration in milliseconds.
     * @param {number} tickInterval - Delay between ticks in milliseconds.
     */
    applyPoison(damagePerTick, duration, tickInterval) {
        if (this.isDefeated) {
            return;
        }
        this.poisonDamagePerTick = damagePerTick;
        this.poisonEndTime = GAME_CLOCK.now() + duration;
        this.poisonTickInterval = tickInterval;
        this.nextPoisonTickTime = GAME_CLOCK.now() + tickInterval;
    }
    /** Updates or clears the active poison effect. */
    updatePoisonStatus() {
        if (!this.isPoisoned()) {
            this.clearExpiredPoison();
            return;
        }
        this.applyPoisonTickIfNeeded();
    }
    /** Applies a poison tick after its interval has elapsed. */
    applyPoisonTickIfNeeded() {
        if (GAME_CLOCK.now() >= this.nextPoisonTickTime) {
            this.takeDamage(this.poisonDamagePerTick);
            this.nextPoisonTickTime = GAME_CLOCK.now() +
                this.poisonTickInterval;
        }
    }
    /** @returns {boolean} Whether the poison effect is currently active. */
    isPoisoned() {
        return GAME_CLOCK.now() < this.poisonEndTime &&
            this.poisonDamagePerTick > 0;
    }
    /** Removes the active poison damage. */
    clearExpiredPoison() {
        this.poisonDamagePerTick = 0;
    }
    /** @returns {boolean} Whether the short damage feedback is active. */
    isHurt() {
        return GAME_CLOCK.now() - this.lastDamageTime <
            GAME_CONFIG.enemyHurtDuration;
    }
    /** @param {number} duration - Trap duration in milliseconds. */
    trap(duration) {
        if (this.canBeTrapped()) {
            this.trappedUntil = GAME_CLOCK.now() + duration;
        }
    }
    /** @returns {boolean} Whether the enemy can currently be trapped. */
    canBeTrapped() {
        return !this.isDefeated;
    }
    /** @returns {boolean} Whether the enemy is currently trapped. */
    isTrapped() {
        return GAME_CLOCK.now() < this.trappedUntil;
    }
    /** @returns {boolean} Whether contact with the enemy can deal damage. */
    canDealContactDamage() {
        return !this.isDefeated && !this.isTrapped();
    }
    /** Restores the complete enemy state for a new level attempt. */
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
        this.playPufferAnimation('swim');
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    draw(context) {
        if (this.isDefeated && this.isAnimationFinished()) {
            return;
        }
        this.drawEnemy(context);
        if (!this.isDefeated) {
            this.drawStatusIndicators(context);
        }
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawEnemy(context) {
        if (this.isImageReady()) {
            this.drawEnemyImage(context);
            return;
        }
        super.draw(context);
        this.drawFallbackDetails(context);
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawEnemyImage(context) {
        if (this.movementController.shouldMirrorSprite()) {
            this.drawMirroredEnemyImage(context);
            return;
        }
        this.drawImage(context);
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawMirroredEnemyImage(context) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(this.image, -this.x - this.width, this.y,
            this.width, this.height);
        context.restore();
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawFallbackDetails(context) {
        this.drawEnemyEye(context);
        this.drawEnemyTentacles(context);
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawEnemyEye(context) {
        context.fillStyle = this.eyeColor;
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + 18, 6, 0, Math.PI * 2);
        context.fill();
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawEnemyTentacles(context) {
        context.strokeStyle = this.fallbackColor;
        context.lineWidth = 4;
        this.drawTentacle(context, 14);
        this.drawTentacle(context, 29);
        this.drawTentacle(context, 44);
    }
    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {number} offsetX - Horizontal tentacle offset.
     */
    drawTentacle(context, offsetX) {
        context.beginPath();
        context.moveTo(this.x + offsetX, this.y + this.height - 8);
        context.lineTo(this.x + offsetX - 6, this.y + this.height + 18);
        context.stroke();
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawStatusIndicators(context) {
        this.drawHurtIndicator(context);
        this.drawTrapIndicator(context);
        this.drawPoisonIndicator(context);
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawHurtIndicator(context) {
        if (!this.isHurt()) {
            return;
        }
        context.strokeStyle = '#ffffff';
        context.lineWidth = 3;
        context.strokeRect(this.x - 4, this.y - 4,
            this.width + 8, this.height + 8);
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawTrapIndicator(context) {
        if (!this.isTrapped()) {
            return;
        }
        context.strokeStyle = 'rgba(169, 236, 255, 0.9)';
        context.lineWidth = 4;
        context.strokeRect(this.x - 5, this.y - 5,
            this.width + 10, this.height + 10);
    }
    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawPoisonIndicator(context) {
        if (!this.isPoisoned()) {
            return;
        }
        context.strokeStyle = '#9dff57';
        context.lineWidth = 3;
        context.strokeRect(this.x - 9, this.y - 9,
            this.width + 18, this.height + 18);
    }
}