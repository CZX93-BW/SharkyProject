'use strict';

class CollectibleObject extends DrawableObject {
    constructor(config = {}) {
        super(config.x, config.y, config.width, config.height);
        this.type = config.type;
        this.value = config.value || 1;
        this.isCollected = false;
        this.fallbackColor = config.fallbackColor;
        this.loadImage(config.imagePath);
    }

    collect() {
        this.isCollected = true;
    }

    reset() {
        this.isCollected = false;
    }

    draw(context) {
        if (this.isCollected) {
            return;
        }

        super.draw(context);
        this.drawFallbackDetails(context);
    }

    drawFallbackDetails(context) {
        if (this.type === 'coin') {
            this.drawCoinDetail(context);
            return;
        }

        this.drawBottleDetail(context);
    }

    drawCoinDetail(context) {
        context.fillStyle = '#fff7a8';
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, 6, 0, Math.PI * 2);
        context.fill();
    }

    drawBottleDetail(context) {
        context.fillStyle = '#143b1f';
        context.fillRect(this.x + 9, this.y + 6, this.width - 18, 8);
        context.fillRect(this.x + 7, this.y + 16, this.width - 14, this.height - 22);
    }
}