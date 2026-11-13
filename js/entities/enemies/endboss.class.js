'use strict';
/** Defines every runtime state used by the end boss state machine. */
const END_BOSS_STATES = Object.freeze({
    IDLE: 'idle',
    INTRODUCE: 'introduce',
    CHASE: 'chase',
    ATTACK: 'attack',
    HURT: 'hurt',
    RETURN: 'return',
    DEAD: 'dead'
});
/**
 * Represents the level boss with introduction, pursuit, attack, return, and
 * fallback-rendering behavior.
 *
 * @extends Enemy
 */
class Endboss extends Enemy {
    /**
     * Creates the boss with level-specific movement and combat values.
     *
     * @param {Object} [config={}] - Boss configuration for the current level.
     */
    constructor(config = {}) {
        super(Endboss.createEnemyConfig(config));
        this.eyeColor = GAME_CONFIG.endbossEyeColor;
        this.configureMovement(config);
        this.configureBehavior(config);
        this.movementController = new BossMovementController(this);
        this.initializeBossState();
        this.playAnimation('floating', 125);
    }

    /** @param {Object} config - Level-specific movement configuration. */
    configureMovement(config) {
        this.speed = config.speed ?? GAME_CONFIG.endbossSpeed;
        this.range = config.patrolRange ?? GAME_CONFIG.endbossPatrolRange;
        this.axis = config.axis ?? 'vertical';
    }

    /**
     * @param {Object} config - Level-specific boss configuration.
     * @returns {Object} Configuration consumed by the base enemy class.
     */
    static createEnemyConfig(config) {
        return {
            x: config.x,
            y: config.y,
            width: config.width ?? GAME_CONFIG.endbossWidth,
            height: config.height ?? GAME_CONFIG.endbossHeight,
            speed: config.speed ?? GAME_CONFIG.endbossSpeed,
            range: config.patrolRange ?? GAME_CONFIG.endbossPatrolRange,
            axis: config.axis ?? 'vertical',
            type: 'endboss',
            damage: config.damage ?? GAME_CONFIG.endbossDamage,
            health: config.health ?? GAME_CONFIG.endbossHealth,
            fallbackColor: GAME_CONFIG.endbossFallbackColor
        };
    }

    /** @param {Object} config - Level-specific behavior configuration. */
    configureBehavior(config) {
        this.introductionDistance = config.introductionDistance ??
            GAME_CONFIG.endbossIntroductionDistance;
        this.activationDistance = config.activationDistance ??
            this.introductionDistance;
        this.chaseDistance = config.chaseDistance ?? this.activationDistance;
        this.attackDistance = config.attackDistance ??
            GAME_CONFIG.endbossAttackDistance;
        this.leashDistance = config.leashDistance ?? this.activationDistance;
        this.attackCooldown = config.attackCooldown ??
            GAME_CONFIG.endbossAttackCooldown;
        this.attackFrameDuration = config.attackFrameDuration ??
            GAME_CONFIG.endbossAttackFrameDuration;
        this.aggression = config.aggression ?? 0.5;
    }

    /** Initializes the state machine for a new level attempt. */
    initializeBossState() {
        this.state = END_BOSS_STATES.IDLE;
        this.isIntroducing = false;
        this.hasBeenIntroduced = false;
        this.lastAttackTime = 0;
    }

    /** Registers animations used exclusively by the end boss. */
    prepareAnimations() {
        const bossAssets = ASSET_CONFIG.enemies.endboss;
        this.addAnimation('introduce', bossAssets.introduce);
        this.addAnimation('floating', bossAssets.floating);
        this.addAnimation('attack', bossAssets.attack);
        this.addAnimation('hurt', bossAssets.hurt);
        this.addAnimation('dead', bossAssets.dead);
    }

    /** @returns {string} Initial boss image path. */
    getDefaultImagePath() {
        return ASSET_CONFIG.enemies.endboss.floating[0];
    }

    /**
     * Updates the boss state machine for one game frame.
     *
     * @param {Character|null} [player=null] - Current player instance.
     * @param {Array<DrawableObject>} [solidAreas=[]] - Blocking world objects.
     * @param {Object|null} [bounds=null] - Optional movement boundaries.
     */
    update(player = null, solidAreas = [], bounds = null) {
        if (this.updateDefeatedStateAnimation()) {
            return;
        }
        this.startIntroductionIfNeeded(player);
        if (this.isIntroducing) {
            this.updateIntroduction();
            return;
        }
        this.updatePoisonStatus();
        if (this.updateDefeatedStateAnimation() || this.updateHurtState()) {
            return;
        }
        this.updateMovementState(player, solidAreas, bounds);
    }

    /**
     * Selects and updates the current active movement state.
     * @param {Character|null} player - Current player.
     * @param {Object[]} solidAreas - Blocking world rectangles.
     * @param {Object|null} bounds - Optional level boundaries.
     */
    updateMovementState(player, solidAreas, bounds) {
        if (this.continueReturnIfNeeded(solidAreas, bounds)) {
            return;
        }
        if (this.state === END_BOSS_STATES.ATTACK) {
            this.updateAttack(player, solidAreas, bounds);
            return;
        }
        this.updateActiveBehavior(player, solidAreas, bounds);
    }

    /**
     * Chooses between return, attack, chase, and patrol behavior.
     * @param {Character|null} player - Current player.
     * @param {Object[]} solidAreas - Blocking world rectangles.
     * @param {Object|null} bounds - Optional level boundaries.
     */
    updateActiveBehavior(player, solidAreas, bounds) {
        if (this.movementController.isOutsideLeash()) {
            this.startReturn();
        } else if (this.canStartAttack(player)) {
            this.startAttack(player);
        } else if (this.shouldChase(player)) {
            this.updateChase(player, solidAreas, bounds);
        } else if (!this.movementController.isInsideHomeArea()) {
            this.startReturn();
        } else {
            this.updateIdle(solidAreas, bounds);
        }
    }

    /** @returns {boolean} Whether the defeated state handled this frame. */
    updateDefeatedStateAnimation() {
        if (!this.isDefeated) {
            return false;
        }
        this.state = END_BOSS_STATES.DEAD;
        this.isIntroducing = false;
        this.playAnimation('dead', 150, false);
        return true;
    }

    /** @returns {boolean} Whether the hurt state handled this frame. */
    updateHurtState() {
        if (!this.shouldPlayHurtAnimation()) {
            return false;
        }
        this.state = END_BOSS_STATES.HURT;
        this.playAnimation('hurt', 90, false);
        return true;
    }

    /** @param {Character|null} player - Current player instance. */
    startIntroductionIfNeeded(player) {
        if (!player || this.hasBeenIntroduced || !this.isPlayerNear(player)) {
            return;
        }
        this.startIntroduction();
    }

    /**
     * @param {Character} player - Current player instance.
     * @returns {boolean} Whether the player entered the activation area.
     */
    isPlayerNear(player) {
        const movement = this.movementController;
        const horizontalDistance = Math.abs(
            movement.getCenterX() - movement.getObjectCenterX(player)
        );
        return horizontalDistance <= this.introductionDistance &&
            movement.getDistanceToPlayer(player) <= this.activationDistance;
    }

    /** Starts the introduction once per level attempt. */
    startIntroduction() {
        if (this.hasBeenIntroduced || this.isDefeated) {
            return;
        }
        this.state = END_BOSS_STATES.INTRODUCE;
        this.isIntroducing = true;
        this.hasBeenIntroduced = true;
        this.playAnimation('introduce', 100, false);
    }

    /** Advances the introduction and returns to idle afterward. */
    updateIntroduction() {
        this.playAnimation('introduce', 100, false);
        if (this.isAnimationFinished()) {
            this.isIntroducing = false;
            this.state = END_BOSS_STATES.IDLE;
            this.playAnimation('floating', 125);
        }
    }

    /**
     * @param {Character|null} player - Current player instance.
     * @returns {boolean} Whether the boss should pursue the player.
     */
    shouldChase(player) {
        return Boolean(player) &&
            this.hasBeenIntroduced &&
            this.movementController.getDistanceToPlayer(player) <=
                this.chaseDistance;
    }

    /**
     * Moves toward the player with aggression-scaled speed.
     * @param {Character} player - Current player.
     * @param {Object[]} solidAreas - Blocking world rectangles.
     * @param {Object|null} bounds - Optional level boundaries.
     */
    updateChase(player, solidAreas, bounds) {
        this.state = END_BOSS_STATES.CHASE;
        this.playAnimation('floating', 110);
        const movement = this.movementController;
        movement.moveTowardsPlayer(player, movement.getChaseSpeed(), solidAreas, bounds);
    }

    /**
     * @param {Character|null} player - Current player instance.
     * @returns {boolean} Whether a new contact attack may begin.
     */
    canStartAttack(player) {
        return Boolean(player) &&
            this.hasBeenIntroduced &&
            this.movementController.getDistanceToPlayer(player) <=
                this.attackDistance &&
            this.isAttackCooldownReady();
    }

    /** @returns {boolean} Whether the configured attack cooldown has elapsed. */
    isAttackCooldownReady() {
        return GAME_CLOCK.now() - this.lastAttackTime >= this.attackCooldown;
    }

    /** @param {Character} player - Current player instance. */
    startAttack(player) {
        this.movementController.facePlayer(player);
        this.state = END_BOSS_STATES.ATTACK;
        this.lastAttackTime = GAME_CLOCK.now();
        this.playAnimation('attack', this.attackFrameDuration, false);
    }

    /**
     * Advances the attack animation and lunge movement.
     * @param {Character|null} player - Current player.
     * @param {Object[]} solidAreas - Blocking world rectangles.
     * @param {Object|null} bounds - Optional level boundaries.
     */
    updateAttack(player, solidAreas, bounds) {
        this.playAnimation('attack', this.attackFrameDuration, false);
        if (player) {
            const movement = this.movementController;
            movement.moveTowardsPlayer(player, movement.getAttackSpeed(), solidAreas, bounds);
        }
        if (this.isAnimationFinished()) {
            this.finishAttack(player);
        }
    }

    /** @param {Character|null} player - Current player instance. */
    finishAttack(player) {
        this.state = this.shouldChase(player) ?
            END_BOSS_STATES.CHASE : END_BOSS_STATES.RETURN;
        this.playAnimation('floating', 110);
    }

    /**
     * @param {Object[]} solidAreas - Blocking world rectangles.
     * @param {Object|null} bounds - Optional level boundaries.
     * @returns {boolean} Whether an existing return state was updated.
     */
    continueReturnIfNeeded(solidAreas, bounds) {
        if (this.state !== END_BOSS_STATES.RETURN) {
            return false;
        }
        this.updateReturn(solidAreas, bounds);
        return true;
    }

    /** Locks the boss into the return state. */
    startReturn() {
        this.state = END_BOSS_STATES.RETURN;
        this.playAnimation('floating', 125);
    }

    /**
     * Moves the boss back to its configured home position.
     * @param {Object[]} solidAreas - Blocking world rectangles.
     * @param {Object|null} bounds - Optional level boundaries.
     */
    updateReturn(solidAreas, bounds) {
        this.state = END_BOSS_STATES.RETURN;
        this.movementController.faceTargetX(this.startX);
        this.playAnimation('floating', 125);
        this.movementController.moveTowardsPoint(
            this.startX,
            this.startY,
            this.movementController.getReturnSpeed(),
            solidAreas,
            bounds
        );
        if (this.movementController.isAtHomePosition()) {
            this.finishReturn();
        }
    }

    /** Snaps the boss to its home position after returning. */
    finishReturn() {
        this.x = this.startX;
        this.y = this.startY;
        this.state = END_BOSS_STATES.IDLE;
    }

    /**
     * Runs the configured patrol while the player is outside chase range.
     * @param {Object[]} solidAreas - Blocking world rectangles.
     * @param {Object|null} bounds - Optional level boundaries.
     */
    updateIdle(solidAreas, bounds) {
        this.state = END_BOSS_STATES.IDLE;
        this.playAnimation('floating', 125);
        this.movementController.updatePatrol(solidAreas, bounds);
    }

    /** @returns {boolean} Whether the hurt animation should remain active. */
    shouldPlayHurtAnimation() {
        const unfinishedHurt = this.currentAnimation === 'hurt' &&
            !this.isAnimationFinished();
        return this.isHurt() || unfinishedHurt;
    }

    /** @returns {boolean} The boss cannot be trapped. */
    canBeTrapped() {
        return false;
    }

    /** @returns {boolean} Whether the boss may currently deal contact damage. */
    canDealContactDamage() {
        return this.state !== END_BOSS_STATES.INTRODUCE &&
            this.state !== END_BOSS_STATES.DEAD &&
            super.canDealContactDamage();
    }

    /** Restores position, health, movement, and boss state. */
    reset() {
        super.reset();
        this.initializeBossState();
        this.playAnimation('floating', 125);
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawFallbackDetails(context) {
        EnemyFallbackRenderer.drawBossDetails(context, this);
    }
}