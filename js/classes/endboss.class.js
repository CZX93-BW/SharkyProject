'use strict';

class Endboss extends Enemy {
    /** Creates the boss with boss-specific values. */
    constructor(config = {}) {
        super({
            x: config.x,
            y: config.y,
            width: GAME_CONFIG.endbossWidth,
            height: GAME_CONFIG.endbossHeight,
            speed:
                config.speed ||
                GAME_CONFIG.endbossSpeed,
            range:
                config.range ||
                GAME_CONFIG.endbossPatrolRange,
            axis: config.axis || 'vertical',
            type: 'endboss',
            damage: GAME_CONFIG.endbossDamage,
            health: GAME_CONFIG.endbossHealth,
            fallbackColor:
                GAME_CONFIG.endbossFallbackColor
        });

        this.eyeColor = GAME_CONFIG.endbossEyeColor;
        this.isIntroducing = false;
        this.hasBeenIntroduced = false;
        this.isAttacking = false;
        this.lastAttackTime = 0;

        this.playAnimation('floating', 125);
    }

    /** Registers all boss animation sequences. */
    prepareAnimations() {
        const bossAssets =
            ASSET_CONFIG.enemies.endboss;

        this.addAnimation(
            'introduce',
            bossAssets.introduce
        );
        this.addAnimation(
            'floating',
            bossAssets.floating
        );
        this.addAnimation(
            'attack',
            bossAssets.attack
        );
        this.addAnimation(
            'hurt',
            bossAssets.hurt
        );
        this.addAnimation(
            'dead',
            bossAssets.dead
        );
    }

    /** Returns the initial boss image. */
    getDefaultImagePath() {
        return ASSET_CONFIG.enemies.endboss.floating[0];
    }

    /** Updates the current boss state. */
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

    /** Starts the introduction when Sharky approaches. */
    startIntroductionIfNeeded(player) {
        if (!player || !this.isPlayerNear(player)) {
            return;
        }

        this.startIntroduction();
    }

    /** Checks the horizontal distance to Sharky. */
    isPlayerNear(player) {
        const distance = Math.abs(
            player.x - this.x
        );

        return distance <=
            GAME_CONFIG.endbossIntroductionDistance;
    }

    /** Starts the introduction once per level attempt. */
    startIntroduction() {
        if (
            this.hasBeenIntroduced ||
            this.isDefeated
        ) {
            return;
        }

        this.isIntroducing = true;
        this.hasBeenIntroduced = true;
        this.playAnimation(
            'introduce',
            100,
            false
        );
    }

    /** Updates the one-time introduction animation. */
    updateIntroduction() {
        this.playAnimation(
            'introduce',
            100,
            false
        );

        if (this.isAnimationFinished()) {
            this.isIntroducing = false;
            this.playAnimation('floating', 125);
        }
    }

    /** Checks whether a new attack may start. */
    canStartAttack(player) {
        return Boolean(player) &&
            this.hasBeenIntroduced &&
            this.isPlayerInAttackRange(player) &&
            this.isAttackCooldownReady();
    }

    /** Checks whether Sharky is in attack range. */
    isPlayerInAttackRange(player) {
        const distance = Math.abs(
            player.x - this.x
        );

        return distance <=
            GAME_CONFIG.endbossAttackDistance;
    }

    /** Checks whether the attack cooldown has passed. */
    isAttackCooldownReady() {
        return Date.now() - this.lastAttackTime >=
            GAME_CONFIG.endbossAttackCooldown;
    }

    /** Starts one boss attack. */
    startAttack(player) {
        this.facePlayer(player);
        this.isAttacking = true;
        this.lastAttackTime = Date.now();

        this.playAnimation(
            'attack',
            GAME_CONFIG.endbossAttackFrameDuration,
            false
        );
    }

    /** Updates the active attack animation. */
    updateAttack() {
        this.playAnimation(
            'attack',
            GAME_CONFIG.endbossAttackFrameDuration,
            false
        );

        if (this.isAnimationFinished()) {
            this.isAttacking = false;
            this.playAnimation('floating', 125);
        }
    }

    /** Turns the boss towards Sharky. */
    facePlayer(player) {
        this.direction = player.x < this.x
            ? -1
            : 1;
    }

    /** Keeps the hurt animation active until it ends. */
    shouldPlayHurtAnimation() {
        const unfinishedHurt =
            this.currentAnimation === 'hurt' &&
            !this.isAnimationFinished();

        return this.isHurt() || unfinishedHurt;
    }

    /** Prevents bubble traps from trapping the boss. */
    canBeTrapped() {
        return false;
    }

    /** Prevents damage during the introduction. */
    canDealContactDamage() {
        return !this.isIntroducing &&
            super.canDealContactDamage();
    }

    /** Resets all boss-specific values. */
    reset() {
        super.reset();

        this.isIntroducing = false;
        this.hasBeenIntroduced = false;
        this.isAttacking = false;
        this.lastAttackTime = 0;

        this.playAnimation('floating', 125);
    }

    /** Draws the boss and active status indicators. */
    draw(context) {
        if (
            this.isDefeated &&
            this.isAnimationFinished()
        ) {
            return;
        }

        this.drawEndboss(context);

        if (!this.isDefeated) {
            this.drawStatusIndicators(context);
        }
    }

    /** Draws the boss image or its fallback. */
    drawEndboss(context) {
        if (this.isImageReady()) {
            this.drawEnemyImage(context);
            return;
        }

        this.drawFallbackEndboss(context);
    }

    /** Draws the complete boss fallback. */
    drawFallbackEndboss(context) {
        this.drawBody(context);
        this.drawFace(context);
        this.drawFins(context);
    }

    /** Draws the fallback body. */
    drawBody(context) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    /** Draws the fallback face. */
    drawFace(context) {
        context.fillStyle = this.eyeColor;
        context.beginPath();
        context.arc(
            this.x + 105,
            this.y + 34,
            9,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    /** Draws the fallback fins. */
    drawFins(context) {
        context.fillStyle = this.fallbackColor;
        this.drawTopFin(context);
        this.drawTailFin(context);
    }

    /** Draws the fallback top fin. */
    drawTopFin(context) {
        context.beginPath();
        context.moveTo(
            this.x + 60,
            this.y
        );
        context.lineTo(
            this.x + 92,
            this.y - 36
        );
        context.lineTo(
            this.x + 108,
            this.y
        );
        context.closePath();
        context.fill();
    }

    /** Draws the fallback tail fin. */
    drawTailFin(context) {
        context.beginPath();
        context.moveTo(
            this.x,
            this.y + 60
        );
        context.lineTo(
            this.x - 40,
            this.y + 24
        );
        context.lineTo(
            this.x - 40,
            this.y + 96
        );
        context.closePath();
        context.fill();
    }
}