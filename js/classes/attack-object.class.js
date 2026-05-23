'use strict';

class AttackObject extends MovableObject {
    constructor(config = {}) {
        super(config.x, config.y, config.width, config.height);
        this.type = config.type;
        this.damage = config.damage || 0;
        this.speed = config.speed || 0;
        this.direction = config.direction || 1;
        this.duration = config.duration || 0;
        this.createdAt = Date.now();
        this.isExpired = false;
        this.hitTargets = new Set();
        this.fallbackColor = config.fallbackColor || '#ffffff';
        this.loadImage(config.imagePath);
    }

    update() {
        this.moveForward();
        this.expireWhenDurationIsOver();
    }

    moveForward() {
        this.x += this.speed * this.direction;
    }

    expireWhenDurationIsOver() {
        if (Date.now() - this.createdAt >= this.duration) {
            this.expire();
        }
    }

    expire() {
        this.isExpired = true;
    }

    hasHit(target) {
        return this.hitTargets.has(target);
    }

    registerHit(target) {
        this.hitTargets.add(target);
    }

    draw(context) {
        if (this.isImageReady()) {
            this.drawImage(context);
            return;
        }

        this.drawFallback(context);
    }
}