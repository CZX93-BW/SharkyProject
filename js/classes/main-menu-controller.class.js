'use strict';

class MainMenuController {
    constructor() {
        this.hero = document.querySelector('.main-menu-hero');
        this.reducedMotionQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );
        this.pointerPosition = { x: 0, y: 0 };
        this.animationFrame = null;
    }

    /** Activates pointer parallax when the menu exists. */
    initialize() {
        if (!this.hero) {
            return;
        }

        this.bindPointerEvents();
        this.resetPosition();
    }

    /** Registers the interactions used by the menu scene. */
    bindPointerEvents() {
        this.hero.addEventListener(
            'pointermove',
            (event) => this.handlePointerMove(event)
        );
        this.hero.addEventListener('pointerleave', () => this.resetPosition());
    }

    /** Stores mouse coordinates and schedules one visual update. */
    handlePointerMove(event) {
        if (!this.shouldUseParallax(event)) {
            return;
        }

        this.pointerPosition = { x: event.clientX, y: event.clientY };
        this.schedulePositionUpdate();
    }

    /** Returns whether motion is suitable for the current input. */
    shouldUseParallax(event) {
        return event.pointerType !== 'touch' &&
            !this.reducedMotionQuery.matches;
    }

    /** Limits pointer updates to one operation per animation frame. */
    schedulePositionUpdate() {
        if (this.animationFrame !== null) {
            return;
        }

        this.animationFrame = requestAnimationFrame(
            () => this.applyPointerPosition()
        );
    }

    /** Converts the pointer position into CSS scene variables. */
    applyPointerPosition() {
        const rectangle = this.hero.getBoundingClientRect();
        const position = this.getNormalizedPosition(rectangle);
        this.setSceneVariables(position);
        this.animationFrame = null;
    }

    /** Returns normalized coordinates between minus one and one. */
    getNormalizedPosition(rectangle) {
        return {
            x: this.normalizeAxis(this.pointerPosition.x, rectangle.left, rectangle.width),
            y: this.normalizeAxis(this.pointerPosition.y, rectangle.top, rectangle.height)
        };
    }

    /** Normalizes one pointer axis relative to its container. */
    normalizeAxis(value, start, size) {
        if (size <= 0) {
            return 0;
        }

        return Math.max(-1, Math.min(1, ((value - start) / size) * 2 - 1));
    }

    /** Updates parallax offset and spotlight position. */
    setSceneVariables(position) {
        this.hero.style.setProperty('--menu-offset-x', `${position.x * -10}px`);
        this.hero.style.setProperty('--menu-offset-y', `${position.y * -6}px`);
        this.hero.style.setProperty('--menu-light-x', `${(position.x + 1) * 50}%`);
        this.hero.style.setProperty('--menu-light-y', `${(position.y + 1) * 50}%`);
    }

    /** Restores the neutral scene without sudden movement. */
    resetPosition() {
        if (!this.hero) {
            return;
        }

        this.setSceneVariables({ x: 0, y: 0 });
    }
}