'use strict';

class AnimatedDrawableObject extends MovableObject {
    /** Creates a movable object with support for named image sequences. */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.animations = {};
        this.currentAnimation = '';
        this.currentFrameIndex = 0;
        this.frameDuration = 120;
        this.lastFrameTime = 0;
        this.animationFinished = false;
    }

    /** Loads and caches all images belonging to one animation. */
    addAnimation(name, imagePaths) {
        this.animations[name] = imagePaths.map((imagePath) => {
            return this.getCachedImage(imagePath);
        });
    }

    /** Selects and updates a named animation. */
    playAnimation(name, frameDuration = 120, loop = true) {
        if (!this.hasAnimation(name)) {
            return;
        }

        this.switchAnimationIfNeeded(name, frameDuration);
        this.advanceAnimation(loop);
        this.applyCurrentFrame();
    }

    /** Returns whether a usable animation exists under the given name. */
    hasAnimation(name) {
        return Array.isArray(this.animations[name]) &&
            this.animations[name].length > 0;
    }

    /** Resets the frame state when another animation starts. */
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

    /** Advances the animation according to elapsed real time. */
    advanceAnimation(loop) {
        const elapsedTime = GAME_CLOCK.animationNow() - this.lastFrameTime;

        if (elapsedTime < this.frameDuration) {
            return;
        }

        const frameSteps = Math.floor(elapsedTime / this.frameDuration);
        this.updateFrameIndex(frameSteps, loop);
        this.lastFrameTime += frameSteps * this.frameDuration;
    }

    /** Calculates the next looping or one-time frame index. */
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

    /** Uses the selected animation frame as the drawable image. */
    applyCurrentFrame() {
        this.image = this.animations[this.currentAnimation][
            this.currentFrameIndex
        ];
    }

    /** Returns whether the current one-time animation has ended. */
    isAnimationFinished() {
        return this.animationFinished;
    }
}