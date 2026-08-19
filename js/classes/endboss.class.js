'use strict';

const END_BOSS_STATES = Object.freeze({
    IDLE: 'idle',
    INTRODUCE: 'introduce',
    CHASE: 'chase',
    ATTACK: 'attack',
    HURT: 'hurt',
    RETURN: 'return',
    DEAD: 'dead'
});

class Endboss extends Enemy {
    /** Creates the boss with level-specific behavior values. */
    constructor(config = {}) {
        super(Endboss.createEnemyConfig(config));
        this.eyeColor = GAME_CONFIG.endbossEyeColor;
        this.configureBehavior(config);
        this.movementController = new BossMovementController(this);
        this.initializeBossState();
        this.playAnimation('floating', 125);
    }

    /** Maps level values to the base enemy configuration. */
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

    /** Stores boss behavior values for the current level. */
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

    /** Creates the initial runtime state for one level attempt. */
    initializeBossState() {
        this.state = END_BOSS_STATES.IDLE;
        this.isIntroducing = false;
        this.hasBeenIntroduced = false;
        this.lastAttackTime = 0;
    }

    /** Registers animation names used only by the Endboss. */
    prepareAnimations() {
        const bossAssets = ASSET_CONFIG.enemies.endboss;
        this.addAnimation('introduce', bossAssets.introduce);
        this.addAnimation('floating', bossAssets.floating);
        this.addAnimation('attack', bossAssets.attack);
        this.addAnimation('hurt', bossAssets.hurt);
        this.addAnimation('dead', bossAssets.dead);
    }

    /** Returns the first boss frame used during loading. */
    getDefaultImagePath() {
        return ASSET_CONFIG.enemies.endboss.floating[0];
    }

    /** Updates the boss state, animation and movement. */
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

    /** Selects the next active movement state. */
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

    /** Chooses between return, attack, chase and idle behavior. */
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

    /** Switches to the dead animation when the boss is defeated. */
    updateDefeatedStateAnimation() {
        if (!this.isDefeated) {
            return false;
        }

        this.state = END_BOSS_STATES.DEAD;
        this.isIntroducing = false;
        this.playAnimation('dead', 150, false);
        return true;
    }

    /** Keeps hurt feedback active until all frames were visible. */
    updateHurtState() {
        if (!this.shouldPlayHurtAnimation()) {
            return false;
        }

        this.state = END_BOSS_STATES.HURT;
        this.playAnimation('hurt', 90, false);
        return true;
    }

    /** Starts Introduce once Sharky enters the activation area. */
    startIntroductionIfNeeded(player) {
        if (!player || this.hasBeenIntroduced || !this.isPlayerNear(player)) {
            return;
        }

        this.startIntroduction();
    }

    /** Checks horizontal and radial activation distances. */
    isPlayerNear(player) {
        const movement = this.movementController;
        const horizontalDistance = Math.abs(movement.getCenterX() -
            movement.getObjectCenterX(player));
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

    /** Advances Introduce and returns to idle afterwards. */
    updateIntroduction() {
        this.playAnimation('introduce', 100, false);

        if (this.isAnimationFinished()) {
            this.isIntroducing = false;
            this.state = END_BOSS_STATES.IDLE;
            this.playAnimation('floating', 125);
        }
    }

    /** Returns whether the boss should actively follow Sharky. */
    shouldChase(player) {
        return Boolean(player) &&
            this.hasBeenIntroduced &&
            this.movementController.getDistanceToPlayer(player) <=
                this.chaseDistance;
    }

    /** Moves towards Sharky with an aggression-scaled speed. */
    updateChase(player, solidAreas, bounds) {
        this.state = END_BOSS_STATES.CHASE;
        this.movementController.facePlayer(player);
        this.playAnimation('floating', 110);
        const target = this.movementController.getPlayerTargetPoint(player);
        this.movementController.moveTowardsPoint(
            target.x,
            target.y,
            this.movementController.getChaseSpeed(),
            solidAreas,
            bounds
        );
    }

    /** Returns whether a new attack may begin. */
    canStartAttack(player) {
        return Boolean(player) &&
            this.hasBeenIntroduced &&
            this.movementController.getDistanceToPlayer(player) <=
                this.attackDistance &&
            this.isAttackCooldownReady();
    }

    /** Returns whether the configured cooldown has passed. */
    isAttackCooldownReady() {
        return GAME_CLOCK.now() - this.lastAttackTime >= this.attackCooldown;
    }

    /** Starts one contact attack and faces Sharky. */
    startAttack(player) {
        this.movementController.facePlayer(player);
        this.state = END_BOSS_STATES.ATTACK;
        this.lastAttackTime = GAME_CLOCK.now();
        this.playAnimation('attack', this.attackFrameDuration, false);
    }

    /** Advances the attack and lunges towards Sharky. */
    updateAttack(player, solidAreas, bounds) {
        this.playAnimation('attack', this.attackFrameDuration, false);

        if (player) {
            const movement = this.movementController;
            const target = movement.getPlayerTargetPoint(player);
            movement.facePlayer(player);
            movement.moveTowardsPoint(target.x, target.y,
                movement.getAttackSpeed(), solidAreas, bounds);
        }

        if (this.isAnimationFinished()) {
            this.finishAttack(player);
        }
    }

    /** Chooses chase or return after an attack animation. */
    finishAttack(player) {
        this.state = this.shouldChase(player) ?
            END_BOSS_STATES.CHASE : END_BOSS_STATES.RETURN;
        this.playAnimation('floating', 110);
    }

    /** Continues an already started return without leash oscillation. */
    continueReturnIfNeeded(solidAreas, bounds) {
        if (this.state !== END_BOSS_STATES.RETURN) {
            return false;
        }

        this.updateReturn(solidAreas, bounds);
        return true;
    }

    /** Locks the current behavior into the return state. */
    startReturn() {
        this.state = END_BOSS_STATES.RETURN;
        this.playAnimation('floating', 125);
    }

    /** Moves back to the configured home position. */
    updateReturn(solidAreas, bounds) {
        this.state = END_BOSS_STATES.RETURN;
        this.movementController.faceTargetX(this.startX);
        this.playAnimation('floating', 125);
        this.movementController.moveTowardsPoint(this.startX, this.startY,
            this.movementController.getReturnSpeed(), solidAreas, bounds);

        if (this.movementController.isAtHomePosition()) {
            this.finishReturn();
        }
    }

    /** Snaps to the home position after returning. */
    finishReturn() {
        this.x = this.startX;
        this.y = this.startY;
        this.state = END_BOSS_STATES.IDLE;
    }

    /** Runs the original patrol while Sharky is outside chase range. */
    updateIdle(solidAreas, bounds) {
        this.state = END_BOSS_STATES.IDLE;
        this.playAnimation('floating', 125);
        this.updatePatrolWithSolidAreas(solidAreas);
        this.movementController.keepInsideBounds(bounds);
    }

    /** Keeps Hurt active long enough to show every frame. */
    shouldPlayHurtAnimation() {
        const unfinishedHurt = this.currentAnimation === 'hurt' &&
            !this.isAnimationFinished();
        return this.isHurt() || unfinishedHurt;
    }

    /** Prevents Bubble Trap from immobilizing the boss. */
    canBeTrapped() {
        return false;
    }

    /** Allows contact damage in every active combat state. */
    canDealContactDamage() {
        return this.state !== END_BOSS_STATES.INTRODUCE &&
            this.state !== END_BOSS_STATES.DEAD &&
            super.canDealContactDamage();
    }

    /** Restores position, health and boss states for a new attempt. */
    reset() {
        super.reset();
        this.initializeBossState();
        this.playAnimation('floating', 125);
    }

    /** Draws the boss and active status indicators. */
    draw(context) {
        if (this.isDefeated && this.isAnimationFinished()) {
            return;
        }

        this.drawEndboss(context);

        if (!this.isDefeated) {
            this.drawStatusIndicators(context);
        }
    }

    /** Selects the sprite or fallback boss drawing. */
    drawEndboss(context) {
        if (this.isImageReady()) {
            this.drawEnemyImage(context);
            return;
        }

        this.drawFallbackEndboss(context);
    }

    /** Draws a scalable fallback when the sprite is unavailable. */
    drawFallbackEndboss(context) {
        this.drawBody(context);
        this.drawFace(context);
        this.drawFins(context);
    }

    /** Draws the fallback body with the configured hitbox size. */
    drawBody(context) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    /** Draws the fallback face proportionally. */
    drawFace(context) {
        context.fillStyle = this.eyeColor;
        context.beginPath();
        context.arc(
            this.x + this.width * 0.7,
            this.y + this.height * 0.28,
            this.height * 0.075,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    /** Draws both fallback fins. */
    drawFins(context) {
        context.fillStyle = this.fallbackColor;
        this.drawTopFin(context);
        this.drawTailFin(context);
    }

    /** Draws the scaled upper fallback fin. */
    drawTopFin(context) {
        context.beginPath();
        context.moveTo(this.x + this.width * 0.4, this.y);
        context.lineTo(this.x + this.width * 0.61,
            this.y - this.height * 0.3);
        context.lineTo(this.x + this.width * 0.72, this.y);
        context.closePath();
        context.fill();
    }

    /** Draws the scaled fallback tail fin. */
    drawTailFin(context) {
        context.beginPath();
        context.moveTo(this.x, this.y + this.height * 0.5);
        context.lineTo(this.x - this.width * 0.27,
            this.y + this.height * 0.2);
        context.lineTo(this.x - this.width * 0.27,
            this.y + this.height * 0.8);
        context.closePath();
        context.fill();
    }
}