'use strict';

class Endboss extends Enemy {
    /** Creates the boss with boss-specific values and animations. */
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

    /** Registers animation names used only by the Endboss. */
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

    /** Returns the first boss frame used during loading. */
    getDefaultImagePath() {
        return ASSET_CONFIG
            .enemies
            .endboss
            .floating[0];
    }

    /** Updates the current boss state in priority order. */
    update(player = null) {
        if (this.isDefeated) {
            this.playAnimation(
                'dead',
                150,
                false
            );

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

            this.playAnimation(
                'hurt',
                90,
                false
            );

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
        if (
            !player ||
            !this.isPlayerNear(player)
        ) {
            return;
        }

        this.startIntroduction();
    }

    /** Returns whether Sharky is horizontally close to the boss. */
    isPlayerNear(player) {
        const distance =
            Math.abs(player.x - this.x);

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

    /** Advances Introduce and returns to Floating afterwards. */
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

    /** Returns whether a new boss attack may begin. */
    canStartAttack(player) {
        return Boolean(player) &&
            this.hasBeenIntroduced &&
            this.isPlayerInAttackRange(player) &&
            this.isAttackCooldownReady();
    }

    /** Returns whether Sharky is inside the attack range. */
    isPlayerInAttackRange(player) {
        const distance =
            Math.abs(player.x - this.x);

        return distance <=
            GAME_CONFIG.endbossAttackDistance;
    }

    /** Returns whether the configured cooldown has passed. */
    isAttackCooldownReady() {
        const timeSinceLastAttack =
            Date.now() - this.lastAttackTime;

        return timeSinceLastAttack >=
            GAME_CONFIG.endbossAttackCooldown;
    }

    /** Starts one attack and turns the boss towards Sharky. */
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

    /** Advances the attack and returns to Floating afterwards. */
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

    /** Faces Sharky before an attack starts. */
    facePlayer(player) {
        this.direction =
            player.x < this.x ? -1 : 1;
    }

    /** Keeps Hurt active long enough to show every frame. */
    shouldPlayHurtAnimation() {
        const unfinishedHurt =
            this.currentAnimation === 'hurt' &&
            !this.isAnimationFinished();

        return this.isHurt() || unfinishedHurt;
    }

    canBeTrapped() {
        return false;
    }

    canDealContactDamage() {
        return !this.isIntroducing &&
            super.canDealContactDamage();
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
        if (
            this.isDefeated &&
            this.isAnimationFinished()
        ) {
            return;
        }

        this.drawEndboss(context);

        if (!this.isDefeated) {
            this.drawHealthBar(context);
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

        context.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

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

    drawFins(context) {
        context.fillStyle = this.fallbackColor;
        this.drawTopFin(context);
        this.drawTailFin(context);
    }

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

    drawHealthBar(context) {
        context.fillStyle = '#1c0c24';

        context.fillRect(
            this.x,
            this.y - 18,
            this.width,
            8
        );

        this.drawHealthBarValue(context);
    }

    drawHealthBarValue(context) {
        const healthPercentage =
            this.health / this.maxHealth;

        const currentWidth =
            this.width * healthPercentage;

        context.fillStyle = '#ffeb5c';

        context.fillRect(
            this.x,
            this.y - 18,
            currentWidth,
            8
        );
    }
}