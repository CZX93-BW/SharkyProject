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

    /** Updates animation, status effects and patrol movement. */
    update() {
        if (this.isDefeated) {
            this.playAnimation(
                'dead',
                150,
                false
            );

            return;
        }

        if (this.isIntroducing) {
            this.updateIntroduction();
            return;
        }

        this.updatePoisonStatus();
        this.updateBossAnimation();
        this.updatePatrol();
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

    /** Selects Hurt until it ends, otherwise Floating. */
    updateBossAnimation() {
        if (this.shouldPlayHurtAnimation()) {
            this.playAnimation(
                'hurt',
                90,
                false
            );

            return;
        }

        this.playAnimation('floating', 125);
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
        context.moveTo(this.x + 60, this.y);
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