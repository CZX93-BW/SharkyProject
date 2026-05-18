'use strict';

class DrawableObject {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = null;
        this.imagePath = '';
        this.fallbackColor = '#ffffff';
    }

    loadImage(imagePath) {
        if (!imagePath) {
            this.clearImage();
            return;
        }

        this.imagePath = imagePath;
        this.image = this.getCachedImage(imagePath);
    }

    clearImage() {
        this.image = null;
        this.imagePath = '';
    }

    getCachedImage(imagePath) {
        if (!DrawableObject.imageCache[imagePath]) {
            DrawableObject.imageCache[imagePath] = this.createImage(imagePath);
        }

        return DrawableObject.imageCache[imagePath];
    }

    createImage(imagePath) {
        const image = new Image();
        image.src = imagePath;
        return image;
    }

    draw(context) {
        if (this.isImageReady()) {
            this.drawImage(context);
            return;
        }

        this.drawFallback(context);
    }

    isImageReady() {
        return this.image && this.image.complete && this.image.naturalWidth > 0;
    }

    drawImage(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    drawFallback(context) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

DrawableObject.imageCache = {};