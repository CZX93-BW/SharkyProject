'use strict';

class BackgroundObject extends DrawableObject {
    constructor(x, y, width, height, config = {}) {
        super(x, y, width, height);
        this.fallbackColor = config.fallbackColor || '#06354f';
        this.scrollFactor = config.scrollFactor || 1;
        this.opacity = config.opacity || 1;
        this.loadImage(config.imagePath);
    }

    draw(context, camera) {
        context.save();
        context.globalAlpha = this.opacity;
        this.drawLayer(context, camera);
        context.restore();
    }

    drawLayer(context, camera) {
        if (this.isImageReady()) {
            this.drawImageWithCamera(context, camera);
            return;
        }

        this.drawFallbackWithCamera(context, camera);
    }

    drawImageWithCamera(context, camera) {
        context.drawImage(
            this.image,
            this.getScreenX(camera),
            this.getScreenY(camera),
            this.width,
            this.height
        );
    }

    drawFallbackWithCamera(context, camera) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(
            this.getScreenX(camera),
            this.getScreenY(camera),
            this.width,
            this.height
        );
    }

    getScreenX(camera) {
        return this.x - camera.x * this.scrollFactor;
    }

    getScreenY(camera) {
        return this.y - camera.y * this.scrollFactor;
    }
}