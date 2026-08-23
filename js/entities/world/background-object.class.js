'use strict';

/**
 * Represents a camera-aware background layer with optional parallax movement.
 *
 * @extends DrawableObject
 */
class BackgroundObject extends DrawableObject {
    /**
     * Creates a background layer from its world and rendering configuration.
     *
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     * @param {number} width - Layer width in world pixels.
     * @param {number} height - Layer height in world pixels.
     * @param {Object} [config={}] - Image and rendering configuration.
     */
    constructor(x, y, width, height, config = {}) {
        super(x, y, width, height);
        this.fallbackColor = config.fallbackColor || '#06354f';
        this.scrollFactor = config.scrollFactor ?? 1;
        this.opacity = config.opacity ?? 1;
        this.loadImage(config.imagePath);
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Camera} camera - Active world camera.
     */
    draw(context, camera) {
        context.save();
        context.globalAlpha = this.opacity;
        this.drawLayer(context, camera);
        context.restore();
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Camera} camera - Active world camera.
     */
    drawLayer(context, camera) {
        if (this.isImageReady()) {
            this.drawImageWithCamera(context, camera);
            return;
        }
        this.drawFallbackWithCamera(context, camera);
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Camera} camera - Active world camera.
     */
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

    /** @returns {Object} Image source rectangle covering the target area. */
    getCoverSource() {
        const imageRatio = this.image.naturalWidth / this.image.naturalHeight;
        const targetRatio = this.width / this.height;
        if (imageRatio > targetRatio) {
            return this.getHorizontalCrop(targetRatio);
        }
        return this.getVerticalCrop(targetRatio);
    }

    /**
     * @param {number} targetRatio - Width-to-height ratio of the target area.
     * @returns {Object} Horizontally cropped image source rectangle.
     */
    getHorizontalCrop(targetRatio) {
        const sourceWidth = this.image.naturalHeight * targetRatio;
        return {
            x: (this.image.naturalWidth - sourceWidth) / 2,
            y: 0,
            width: sourceWidth,
            height: this.image.naturalHeight
        };
    }

    /**
     * @param {number} targetRatio - Width-to-height ratio of the target area.
     * @returns {Object} Vertically cropped image source rectangle.
     */
    getVerticalCrop(targetRatio) {
        const sourceHeight = this.image.naturalWidth / targetRatio;
        return {
            x: 0,
            y: (this.image.naturalHeight - sourceHeight) / 2,
            width: this.image.naturalWidth,
            height: sourceHeight
        };
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Camera} camera - Active world camera.
     */
    drawFallbackWithCamera(context, camera) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(
            this.getScreenX(camera),
            this.getScreenY(camera),
            this.width,
            this.height
        );
    }

    /**
     * @param {Camera} camera - Active world camera.
     * @returns {number} Parallax-adjusted horizontal screen position.
     */
    getScreenX(camera) {
        return this.x - camera.x * this.scrollFactor;
    }

    /**
     * @param {Camera} camera - Active world camera.
     * @returns {number} Parallax-adjusted vertical screen position.
     */
    getScreenY(camera) {
        return this.y - camera.y * this.scrollFactor;
    }
}

/**
 * Represents a visible level object that also provides a collision area.
 *
 * @extends DrawableObject
 */
class BarrierObject extends DrawableObject {
    /**
     * Creates a barrier from its visual and collision configuration.
     *
     * @param {Object} [config={}] - Barrier configuration.
     */
    constructor(config = {}) {
        super(config.x, config.y, config.width, config.height);
        this.fallbackColor = config.fallbackColor || '#211d69';
        this.collisionInset = this.createCollisionInset(config.collisionInset);
        this.loadImage(config.imagePath);
    }

    /**
     * @param {Object} [collisionInset={}] - Optional inset for every side.
     * @returns {Object} Normalized collision inset.
     */
    createCollisionInset(collisionInset = {}) {
        return {
            left: collisionInset.left || 0,
            right: collisionInset.right || 0,
            top: collisionInset.top || 0,
            bottom: collisionInset.bottom || 0
        };
    }

    /** @returns {Object} Solid rectangle used for collision detection. */
    getSolidArea() {
        return {
            x: this.x + this.collisionInset.left,
            y: this.y + this.collisionInset.top,
            width: this.getCollisionWidth(),
            height: this.getCollisionHeight()
        };
    }

    /** @returns {number} Barrier width after horizontal insets. */
    getCollisionWidth() {
        return this.width -
            this.collisionInset.left -
            this.collisionInset.right;
    }

    /** @returns {number} Barrier height after vertical insets. */
    getCollisionHeight() {
        return this.height -
            this.collisionInset.top -
            this.collisionInset.bottom;
    }
}