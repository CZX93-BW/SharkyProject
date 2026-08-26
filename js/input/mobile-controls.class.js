'use strict';

/** Connects touch joystick and attack controls to the shared keyboard state. */
class MobileControls {
    /** @param {Keyboard} keyboard - Shared game input state. */
    constructor(keyboard) {
        this.keyboard = keyboard;
        this.joystickArea =
            document.getElementById('mobileJoystick');
        this.joystickKnob =
            document.getElementById('mobileJoystickKnob');
        this.activePointerId = null;
        this.coarsePointerQuery =
            window.matchMedia('(pointer: coarse)');
        this.maximumTouchLayoutWidth = 1180;
        this.initializeAvailability();
        this.bindControlEvents();
    }

    /** Detects touch layouts and synchronizes their visibility. */
    initializeAvailability() {
        this.updateAvailability();
        window.addEventListener(
            'resize',
            () => this.updateAvailability()
        );

        if (this.coarsePointerQuery.addEventListener) {
            this.bindModernPointerQuery();
            return;
        }

        this.bindLegacyPointerQuery();
    }

    /** Registers the modern media-query change listener. */
    bindModernPointerQuery() {
        this.coarsePointerQuery.addEventListener(
            'change',
            () => this.updateAvailability()
        );
    }

    /** Registers the legacy media-query change listener. */
    bindLegacyPointerQuery() {
        this.coarsePointerQuery.addListener?.(
            () => this.updateAvailability()
        );
    }

    /** Applies the touch-control class to suitable devices. */
    updateAvailability() {
        const isEnabled = this.shouldEnableTouchControls();
        document.documentElement.classList.toggle(
            'has-touch-controls',
            isEnabled
        );

        if (!isEnabled) {
            this.resetControls();
        }
    }

    /**
     * @returns {boolean} Whether touch controls suit the device and width.
     */
    shouldEnableTouchControls() {
        const hasTouchPoints =
            navigator.maxTouchPoints > 0;
        const hasCoarsePointer =
            this.coarsePointerQuery.matches;

        return (hasTouchPoints || hasCoarsePointer) &&
            window.innerWidth <= this.maximumTouchLayoutWidth;
    }

    /** Clears active touch input when controls become unavailable. */
    resetControls() {
        this.activePointerId = null;
        this.keyboard.resetMobileMovement();
        this.resetMobileActions();
        this.resetJoystickKnob();
    }

    /** Releases every mobile attack action. */
    resetMobileActions() {
        ['slap', 'bubble', 'poison'].forEach((action) => {
            this.keyboard.setMobileAction(action, false);
        });
    }

    /** Registers listeners when required elements exist. */
    bindControlEvents() {
        if (!this.hasRequiredElements()) {
            return;
        }

        this.bindJoystickEvents();
        this.bindAttackButtons();
    }

    /** @returns {HTMLElement|null} Last required element or null. */
    hasRequiredElements() {
        return this.joystickArea && this.joystickKnob;
    }

    /** Registers joystick pointer lifecycle listeners. */
    bindJoystickEvents() {
        this.joystickArea.addEventListener(
            'pointerdown',
            (event) => this.startJoystick(event)
        );

        this.joystickArea.addEventListener(
            'contextmenu',
            (event) => this.preventContextMenu(event)
        );

        this.bindJoystickWindowEvents();
    }

    /** Registers window-level joystick lifecycle listeners. */
    bindJoystickWindowEvents() {
        window.addEventListener('pointermove', (event) => {
            this.moveJoystick(event);
        });

        window.addEventListener('pointerup', (event) => {
            this.stopJoystick(event);
        });

        window.addEventListener('pointercancel', (event) => {
            this.stopJoystick(event);
        });
    }

    /** @param {PointerEvent} event - Joystick pointer-down event. */
    startJoystick(event) {
        event.preventDefault();
        this.activePointerId = event.pointerId;
        this.joystickArea.setPointerCapture(event.pointerId);
        this.updateJoystick(event);
    }

    /** @param {PointerEvent} event - Joystick move event. */
    moveJoystick(event) {
        if (event.pointerId !== this.activePointerId) {
            return;
        }

        event.preventDefault();
        this.updateJoystick(event);
    }

    /** @param {PointerEvent} event - Joystick release event. */
    stopJoystick(event) {
        if (event.pointerId !== this.activePointerId) {
            return;
        }

        this.activePointerId = null;
        this.keyboard.resetMobileMovement();
        this.resetJoystickKnob();
    }

    /** @param {PointerEvent} event - Current joystick event. */
    updateJoystick(event) {
        const rectangle =
            this.joystickArea.getBoundingClientRect();
        const center =
            this.getJoystickCenter(rectangle);
        const limitedDelta =
            this.getLimitedDelta(event, center);

        this.updateMobileMovement(limitedDelta);
        this.moveJoystickKnob(limitedDelta);
    }

    /**
     * @param {DOMRect} rectangle - Joystick area bounds.
     * @returns {Object} Joystick center coordinates.
     */
    getJoystickCenter(rectangle) {
        return {
            x: rectangle.left + rectangle.width / 2,
            y: rectangle.top + rectangle.height / 2
        };
    }

    /**
     * @param {PointerEvent} event - Current pointer event.
     * @param {Object} center - Joystick center coordinates.
     * @returns {Object} Delta restricted to the joystick radius.
     */
    getLimitedDelta(event, center) {
        const delta =
            this.getPointerDelta(event, center);
        const distance =
            Math.hypot(delta.x, delta.y);
        const maxDistance =
            this.getMaximumJoystickDistance();

        if (distance <= maxDistance) {
            return delta;
        }

        return this.getNormalizedDelta(
            delta,
            distance,
            maxDistance
        );
    }

    /**
     * @param {PointerEvent} event - Current pointer event.
     * @param {Object} center - Joystick center coordinates.
     * @returns {Object} Raw pointer distance from the center.
     */
    getPointerDelta(event, center) {
        return {
            x: event.clientX - center.x,
            y: event.clientY - center.y
        };
    }

    /**
     * @param {Object} delta - Raw pointer delta.
     * @param {number} distance - Raw pointer distance.
     * @param {number} maxDistance - Maximum travel distance.
     * @returns {Object} Delta scaled to the maximum distance.
     */
    getNormalizedDelta(delta, distance, maxDistance) {
        const factor = maxDistance / distance;

        return {
            x: delta.x * factor,
            y: delta.y * factor
        };
    }

    /** @param {Object} delta - Limited joystick delta. */
    updateMobileMovement(delta) {
        const maxDistance =
            this.getMaximumJoystickDistance();

        this.keyboard.setMobileMovement(
            delta.x / maxDistance,
            delta.y / maxDistance
        );
    }

    /** @returns {number} Safe joystick travel radius. */
    getMaximumJoystickDistance() {
        const areaRadius =
            this.joystickArea.clientWidth / 2;
        const knobRadius =
            this.joystickKnob.clientWidth / 2;

        return Math.min(
            GAME_CONFIG.mobileJoystickMaxDistance,
            Math.max(1, areaRadius - knobRadius - 4)
        );
    }

    /** @param {Object} delta - Limited joystick delta. */
    moveJoystickKnob(delta) {
        this.joystickKnob.style.transform =
            `translate(${delta.x}px, ${delta.y}px)`;
    }

    /** Restores the joystick knob to its neutral position. */
    resetJoystickKnob() {
        if (this.joystickKnob) {
            this.joystickKnob.style.transform =
                'translate(0, 0)';
        }
    }

    /** Registers listeners for all mobile attack buttons. */
    bindAttackButtons() {
        const attackButtons =
            document.querySelectorAll('[data-mobile-action]');

        attackButtons.forEach((button) => {
            this.bindAttackButton(button);
        });
    }

    /** @param {HTMLElement} button - Mobile attack button. */
    bindAttackButton(button) {
        button.addEventListener('pointerdown', (event) => {
            this.startAttack(event, button);
        });

        this.bindAttackReleaseEvents(button);

        button.addEventListener('contextmenu', (event) => {
            this.preventContextMenu(event);
        });
    }

    /** @param {HTMLElement} button - Mobile attack button. */
    bindAttackReleaseEvents(button) {
        const releaseEvents = [
            'pointerup',
            'pointercancel',
            'pointerleave'
        ];

        releaseEvents.forEach((eventName) => {
            button.addEventListener(eventName, (event) => {
                this.stopAttack(event, button);
            });
        });
    }

    /** @param {Event} event - Context-menu event to suppress. */
    preventContextMenu(event) {
        event.preventDefault();
    }

    /**
     * @param {PointerEvent} event - Attack pointer-down event.
     * @param {HTMLElement} button - Pressed attack button.
     */
    startAttack(event, button) {
        event.preventDefault();
        this.keyboard.setMobileAction(
            button.dataset.mobileAction,
            true
        );
    }

    /**
     * @param {PointerEvent} event - Attack release event.
     * @param {HTMLElement} button - Released attack button.
     */
    stopAttack(event, button) {
        event.preventDefault();
        this.keyboard.setMobileAction(
            button.dataset.mobileAction,
            false
        );
    }
}