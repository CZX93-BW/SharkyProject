'use strict';

/**
 * Extends movable canvas objects with reusable frame-based animations.
 * Animation timing is controlled by the shared game clock.
 *
 * @extends MovableObject
 */
class AnimatedDrawableObject extends MovableObject {
    /**
     * Creates an animated drawable object.
     *
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     * @param {number} width - Rendered width in pixels.
     * @param {number} height - Rendered height in pixels.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.animations = {};
        this.currentAnimation = '';
        this.currentFrameIndex = 0;
        this.frameDuration = 120;
        this.lastFrameTime = 0;
        this.animationFinished = false;
    }

    /**
     * Loads and caches every frame belonging to an animation.
     *
     * @param {string} name - Unique animation name.
     * @param {string[]} imagePaths - Ordered paths of all animation frames.
     * @returns {void}
     */
    addAnimation(name, imagePaths) {
        this.animations[name] = imagePaths.map((imagePath) => {
            return this.getCachedImage(imagePath);
        });
    }

    /**
     * Selects and advances a named animation.
     *
     * @param {string} name - Registered animation name.
     * @param {number} [frameDuration=120] - Frame duration in milliseconds.
     * @param {boolean} [loop=true] - Whether the animation repeats.
     * @returns {void}
     */
    playAnimation(name, frameDuration = 120, loop = true) {
        if (!this.hasAnimation(name)) {
            return;
        }

        this.switchAnimationIfNeeded(name, frameDuration);
        this.advanceAnimation(loop);
        this.applyCurrentFrame();
    }

    /**
     * Checks whether a registered animation contains usable frames.
     *
     * @param {string} name - Animation name to inspect.
     * @returns {boolean} Whether at least one frame is registered.
     */
    hasAnimation(name) {
        return Array.isArray(this.animations[name]) &&
            this.animations[name].length > 0;
    }

    /**
     * Resets frame state when the active animation changes.
     *
     * @param {string} name - Animation that should become active.
     * @param {number} frameDuration - Frame duration in milliseconds.
     * @returns {void}
     */
    switchAnimationIfNeeded(name, frameDuration) {
        if (this.currentAnimation === name) {
            return;
        }

        this.currentAnimation = name;
        this.currentFrameIndex = 0;
        this.frameDuration = frameDuration;
        this.lastFrameTime = GAME_CLOCK.animationNow();
        this.animationFinished = false;
    }

    /**
     * Advances the animation according to elapsed animation time.
     *
     * @param {boolean} loop - Whether the animation repeats.
     * @returns {void}
     */
    advanceAnimation(loop) {
        const elapsedTime = GAME_CLOCK.animationNow() - this.lastFrameTime;

        if (elapsedTime < this.frameDuration) {
            return;
        }

        const frameSteps = Math.floor(elapsedTime / this.frameDuration);
        this.updateFrameIndex(frameSteps, loop);
        this.lastFrameTime += frameSteps * this.frameDuration;
    }

    /**
     * Calculates the next looping or one-time frame index.
     *
     * @param {number} frameSteps - Number of elapsed animation frames.
     * @param {boolean} loop - Whether the animation repeats.
     * @returns {void}
     */
    updateFrameIndex(frameSteps, loop) {
        const frameCount = this.animations[this.currentAnimation].length;
        const nextFrameIndex = this.currentFrameIndex + frameSteps;

        if (loop) {
            this.currentFrameIndex = nextFrameIndex % frameCount;
            return;
        }

        this.currentFrameIndex = Math.min(nextFrameIndex, frameCount - 1);
        this.animationFinished = nextFrameIndex >= frameCount - 1;
    }

    /**
     * Applies the selected animation frame as the current image.
     *
     * @returns {void}
     */
    applyCurrentFrame() {
        this.image = this.animations[this.currentAnimation][
            this.currentFrameIndex
        ];
    }

    /**
     * Reports whether the current one-time animation has ended.
     *
     * @returns {boolean} Whether the final frame has been reached.
     */
    isAnimationFinished() {
        return this.animationFinished;
    }
}