'use strict';

/**
 * Represents a rectangular object that can be rendered on a canvas.
 * Images are shared through a class-level cache to prevent duplicate loading.
 */
class DrawableObject {
    /**
     * Creates a drawable object.
     *
     * @param {number} [x=0] - Initial horizontal position.
     * @param {number} [y=0] - Initial vertical position.
     * @param {number} [width=0] - Rendered width in pixels.
     * @param {number} [height=0] - Rendered height in pixels.
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = null;
        this.imagePath = '';
        this.fallbackColor = '#ffffff';
    }

    /**
     * Loads an image or clears the current image for an empty path.
     *
     * @param {string} imagePath - Relative path of the image asset.
     * @returns {void}
     */
    loadImage(imagePath) {
        if (!imagePath) {
            this.clearImage();
            return;
        }

        this.imagePath = imagePath;
        this.image = this.getCachedImage(imagePath);
    }

    /**
     * Removes the current image and its stored path.
     *
     * @returns {void}
     */
    clearImage() {
        this.image = null;
        this.imagePath = '';
    }

    /**
     * Returns a cached image or creates it when first requested.
     *
     * @param {string} imagePath - Relative path of the image asset.
     * @returns {HTMLImageElement} Cached or newly created image element.
     */
    getCachedImage(imagePath) {
        if (!DrawableObject.imageCache[imagePath]) {
            DrawableObject.imageCache[imagePath] =
                this.createImage(imagePath);
        }

        return DrawableObject.imageCache[imagePath];
    }

    /**
     * Creates an image element for one asset path.
     *
     * @param {string} imagePath - Relative path of the image asset.
     * @returns {HTMLImageElement} Created image element.
     */
    createImage(imagePath) {
        const image = new Image();
        image.src = imagePath;
        return image;
    }

    /**
     * Draws the loaded image or a colored fallback rectangle.
     *
     * @param {CanvasRenderingContext2D} context - Target canvas context.
     * @returns {void}
     */
    draw(context) {
        if (this.isImageReady()) {
            this.drawImage(context);
            return;
        }

        this.drawFallback(context);
    }

    /**
     * Checks whether the current image can be rendered safely.
     *
     * @returns {boolean} Whether the image finished loading successfully.
     */
    isImageReady() {
        return Boolean(
            this.image && this.image.complete && this.image.naturalWidth > 0
        );
    }

    /**
     * Draws the current image inside the object's bounds.
     *
     * @param {CanvasRenderingContext2D} context - Target canvas context.
     * @returns {void}
     */
    drawImage(context) {
        context.drawImage(
            this.image,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    /**
     * Draws a colored rectangle when no image is available.
     *
     * @param {CanvasRenderingContext2D} context - Target canvas context.
     * @returns {void}
     */
    drawFallback(context) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Returns the horizontal coordinate of the right object edge.
     *
     * @returns {number} Right edge position.
     */
    getRightSide() {
        return this.x + this.width;
    }

    /**
     * Returns the vertical coordinate of the bottom object edge.
     *
     * @returns {number} Bottom edge position.
     */
    getBottomSide() {
        return this.y + this.height;
    }
}

/** @type {Object<string, HTMLImageElement>} Shared image cache by asset path. */
DrawableObject.imageCache = {};