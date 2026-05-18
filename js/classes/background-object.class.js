'use strict';

class BackgroundObject extends DrawableObject {
    constructor(x, y, width, height, imagePath, fallbackColor, scrollFactor = 1) {
        super(x, y, width, height);
        this.fallbackColor = fallbackColor;
        this.scrollFactor = scrollFactor;
        this.loadImage(imagePath);
    }

    draw(context, camera) {
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