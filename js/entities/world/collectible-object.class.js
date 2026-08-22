'use strict';

class CollectibleObject extends AnimatedDrawableObject {
    /** Creates an animated coin or poison bottle. */
    constructor(config = {}) {
        super(config.x, config.y, config.width, config.height);
        this.type = config.type;
        this.value = config.value || 1;
        this.isCollected = false;
        this.fallbackColor = config.fallbackColor;
        this.animationImages = config.animationImages || [];
        this.frameDuration = config.frameDuration || 140;
        this.animationName = this.getAnimationName();
        this.registerAnimation();
        this.loadImage(config.imagePath);
    }

    /** Returns the animation name belonging to the collectible type. */
    getAnimationName() {
        return this.type === 'coin' ? 'coin' : 'poisonBottle';
    }

    /** Registers the configured image sequence. */
    registerAnimation() {
        this.addAnimation(this.animationName, this.animationImages);
    }

    /** Updates the animation while the object is active. */
    update() {
        if (this.isCollected) {
            return;
        }

        this.playAnimation(
            this.animationName,
            this.frameDuration,
            true
        );
    }

    /** Marks the collectible as collected. */
    collect() {
        this.isCollected = true;
    }

    /** Restores the collectible for a level restart. */
    reset() {
        this.isCollected = false;
        this.currentAnimation = '';
        this.currentFrameIndex = 0;
        this.animationFinished = false;
    }

    /** Draws only active collectibles. */
    draw(context) {
        if (this.isCollected) {
            return;
        }

        const hasReadyImage = this.isImageReady();
        super.draw(context);

        if (!hasReadyImage) {
            this.drawFallbackDetails(context);
        }
    }

    /** Draws a fallback based on the collectible type. */
    drawFallbackDetails(context) {
        if (this.type === 'coin') {
            this.drawCoinDetail(context);
            return;
        }

        this.drawBottleDetail(context);
    }

    /** Draws the inner detail of the coin fallback. */
    drawCoinDetail(context) {
        context.fillStyle = '#fff7a8';
        context.beginPath();
        context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            6,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    /** Draws the details of the bottle fallback. */
    drawBottleDetail(context) {
        context.fillStyle = '#143b1f';
        context.fillRect(
            this.x + 9,
            this.y + 6,
            this.width - 18,
            8
        );
        context.fillRect(
            this.x + 7,
            this.y + 16,
            this.width - 14,
            this.height - 22
        );
    }
}