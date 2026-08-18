'use strict';

class Endboss extends Enemy {
    /** Creates the boss with boss-specific values and animations. */
    constructor(config = {}) {
        super(Endboss.createEnemyConfig(config));
        this.eyeColor = GAME_CONFIG.endbossEyeColor;
        this.configureBehavior(config);
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
        this.isIntroducing = false;
        this.hasBeenIntroduced = false;
        this.isAttacking = false;
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

    /** Updates the current boss state in priority order. */
    update(player = null) {
        if (this.isDefeated) {
            this.playAnimation('dead', 150, false);
            return;
        }

        this.startIntroductionIfNeeded(player);

        if (this.isIntroducing) {
            this.updateIntroduction();
            return;
        }

        this.updatePoisonStatus();

        if (this.shouldPlayHurtAnimation()) {
            this.isAttacking = false;
            this.playAnimation('hurt', 90, false);
            return;
        }

        if (this.isAttacking) {
            this.updateAttack();
            return;
        }

        if (this.canStartAttack(player)) {
            this.startAttack(player);
            return;
        }

        this.playAnimation('floating', 125);
        this.updatePatrol();
    }

    /** Starts Introduce once Sharky enters the activation distance. */
    startIntroductionIfNeeded(player) {
        if (!player || !this.isPlayerNear(player)) {
            return;
        }

        this.startIntroduction();
    }

    /** Returns whether Sharky is horizontally close to the boss. */
    isPlayerNear(player) {
        const distance = Math.abs(player.x - this.x);
        return distance <= this.introductionDistance;
    }

    /** Starts the introduction once per level attempt. */
    startIntroduction() {
        if (this.hasBeenIntroduced || this.isDefeated) {
            return;
        }

        this.isIntroducing = true;
        this.hasBeenIntroduced = true;
        this.playAnimation('introduce', 100, false);
    }

    /** Advances Introduce and returns to Floating afterwards. */
    updateIntroduction() {
        this.playAnimation('introduce', 100, false);

        if (this.isAnimationFinished()) {
            this.isIntroducing = false;
            this.playAnimation('floating', 125);
        }
    }

    /** Returns whether a new boss attack may begin. */
    canStartAttack(player) {
        return Boolean(player) &&
            this.hasBeenIntroduced &&
            this.isPlayerInAttackRange(player) &&
            this.isAttackCooldownReady();
    }

    /** Returns whether Sharky is inside the attack range. */
    isPlayerInAttackRange(player) {
        const distance = Math.abs(player.x - this.x);
        return distance <= this.attackDistance;
    }

    /** Returns whether the configured cooldown has passed. */
    isAttackCooldownReady() {
        return Date.now() - this.lastAttackTime >= this.attackCooldown;
    }

    /** Starts one attack and turns the boss towards Sharky. */
    startAttack(player) {
        this.facePlayer(player);
        this.isAttacking = true;
        this.lastAttackTime = Date.now();
        this.playAnimation(
            'attack',
            this.attackFrameDuration,
            false
        );
    }

    /** Advances the attack and returns to Floating afterwards. */
    updateAttack() {
        this.playAnimation(
            'attack',
            this.attackFrameDuration,
            false
        );

        if (this.isAnimationFinished()) {
            this.isAttacking = false;
            this.playAnimation('floating', 125);
        }
    }

    /** Faces Sharky before an attack starts. */
    facePlayer(player) {
        this.direction = player.x < this.x ? -1 : 1;
    }

    /** Keeps Hurt active long enough to show every frame. */
    shouldPlayHurtAnimation() {
        const unfinishedHurt = this.currentAnimation === 'hurt' &&
            !this.isAnimationFinished();

        return this.isHurt() || unfinishedHurt;
    }

    canBeTrapped() {
        return false;
    }

    canDealContactDamage() {
        return !this.isIntroducing && super.canDealContactDamage();
    }

    reset() {
        super.reset();
        this.isIntroducing = false;
        this.hasBeenIntroduced = false;
        this.isAttacking = false;
        this.lastAttackTime = 0;
        this.playAnimation('floating', 125);
    }

    draw(context) {
        if (this.isDefeated && this.isAnimationFinished()) {
            return;
        }

        this.drawEndboss(context);

        if (!this.isDefeated) {
            this.drawStatusIndicators(context);
        }
    }

    drawEndboss(context) {
        if (this.isImageReady()) {
            this.drawEnemyImage(context);
            return;
        }

        this.drawFallbackEndboss(context);
    }

    drawFallbackEndboss(context) {
        this.drawBody(context);
        this.drawFace(context);
        this.drawFins(context);
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

}