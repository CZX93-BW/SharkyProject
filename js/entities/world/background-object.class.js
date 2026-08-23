'use strict';

class BackgroundObject extends DrawableObject {
    /**
     * Creates one camera-aware background layer.
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     * @param {number} width - Layer width in world pixels.
     * @param {number} height - Layer height in world pixels.
     * @param {Object} config - Image and rendering configuration.
     */
    constructor(x, y, width, height, config = {}) {
        super(x, y, width, height);
        this.fallbackColor = config.fallbackColor || '#06354f';
        this.scrollFactor = config.scrollFactor ?? 1;
        this.opacity = config.opacity ?? 1;
        this.loadImage(config.imagePath);
    }

    /** Draws the layer with its configured opacity. */
    draw(context, camera) {
        context.save();
        context.globalAlpha = this.opacity;
        this.drawLayer(context, camera);
        context.restore();
    }

    /** Draws either the loaded image or its color fallback. */
    drawLayer(context, camera) {
        if (this.isImageReady()) {
            this.drawImageWithCamera(context, camera);
            return;
        }

        this.drawFallbackWithCamera(context, camera);
    }

    /** Draws the image without changing its aspect ratio. */
    drawImageWithCamera(context, camera) {
        const source = this.getCoverSource();

        context.drawImage(
            this.image,
            source.x,
            source.y,
            source.width,
            source.height,
            this.getScreenX(camera),
            this.getScreenY(camera),
            this.width,
            this.height
        );
    }

    /** Returns the image section required to cover the target rectangle. */
    getCoverSource() {
        const imageRatio = this.image.naturalWidth / this.image.naturalHeight;
        const targetRatio = this.width / this.height;

        if (imageRatio > targetRatio) {
            return this.getHorizontalCrop(targetRatio);
        }

        return this.getVerticalCrop(targetRatio);
    }

    /** Crops equal parts from the image's left and right edges. */
    getHorizontalCrop(targetRatio) {
        const sourceWidth = this.image.naturalHeight * targetRatio;

        return {
            x: (this.image.naturalWidth - sourceWidth) / 2,
            y: 0,
            width: sourceWidth,
            height: this.image.naturalHeight
        };
    }

    /** Crops equal parts from the image's top and bottom edges. */
    getVerticalCrop(targetRatio) {
        const sourceHeight = this.image.naturalWidth / targetRatio;

        return {
            x: 0,
            y: (this.image.naturalHeight - sourceHeight) / 2,
            width: this.image.naturalWidth,
            height: sourceHeight
        };
    }

    /** Draws the fallback color at the camera-adjusted position. */
    drawFallbackWithCamera(context, camera) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(
            this.getScreenX(camera),
            this.getScreenY(camera),
            this.width,
            this.height
        );
    }

    /** Returns the horizontal screen position for this parallax layer. */
    getScreenX(camera) {
        return this.x - camera.x * this.scrollFactor;
    }

    /** Returns the vertical screen position for this parallax layer. */
    getScreenY(camera) {
        return this.y - camera.y * this.scrollFactor;
    }
}

class BarrierObject extends DrawableObject {
    /** Creates one visible and collidable world barrier. */
    constructor(config = {}) {
        super(config.x, config.y, config.width, config.height);
        this.fallbackColor = config.fallbackColor || '#211d69';
        this.collisionInset = this.createCollisionInset(config.collisionInset);
        this.loadImage(config.imagePath);
    }

    /** Normalizes optional collision insets for all four sides. */
    createCollisionInset(collisionInset = {}) {
        return {
            left: collisionInset.left || 0,
            right: collisionInset.right || 0,
            top: collisionInset.top || 0,
            bottom: collisionInset.bottom || 0
        };
    }

    /** Returns the solid area used by the collision manager. */
    getSolidArea() {
        return {
            x: this.x + this.collisionInset.left,
            y: this.y + this.collisionInset.top,
            width: this.getCollisionWidth(),
            height: this.getCollisionHeight()
        };
    }

    /** Returns the barrier width after horizontal insets. */
    getCollisionWidth() {
        return this.width -
            this.collisionInset.left -
            this.collisionInset.right;
    }

    /** Returns the barrier height after vertical insets. */
    getCollisionHeight() {
        return this.height -
            this.collisionInset.top -
            this.collisionInset.bottom;
    }
}
