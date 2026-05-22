'use strict';

class MobileControls {
    constructor(keyboard) {
        this.keyboard = keyboard;
        this.joystickArea = document.getElementById('mobileJoystick');
        this.joystickKnob = document.getElementById('mobileJoystickKnob');
        this.activePointerId = null;
        this.bindControlEvents();
    }

    bindControlEvents() {
        if (!this.hasRequiredElements()) {
            return;
        }

        this.bindJoystickEvents();
        this.bindAttackButtons();
    }

    hasRequiredElements() {
        return this.joystickArea && this.joystickKnob;
    }

    bindJoystickEvents() {
        this.joystickArea.addEventListener('pointerdown', (event) => this.startJoystick(event));
        window.addEventListener('pointermove', (event) => this.moveJoystick(event));
        window.addEventListener('pointerup', (event) => this.stopJoystick(event));
        window.addEventListener('pointercancel', (event) => this.stopJoystick(event));
    }

    startJoystick(event) {
        event.preventDefault();
        this.activePointerId = event.pointerId;
        this.joystickArea.setPointerCapture(event.pointerId);
        this.updateJoystick(event);
    }

    moveJoystick(event) {
        if (event.pointerId !== this.activePointerId) {
            return;
        }

        event.preventDefault();
        this.updateJoystick(event);
    }

    stopJoystick(event) {
        if (event.pointerId !== this.activePointerId) {
            return;
        }

        this.activePointerId = null;
        this.keyboard.resetMobileMovement();
        this.resetJoystickKnob();
    }

    updateJoystick(event) {
        const rectangle = this.joystickArea.getBoundingClientRect();
        const center = this.getJoystickCenter(rectangle);
        const limitedDelta = this.getLimitedDelta(event, center);

        this.updateMobileMovement(limitedDelta);
        this.moveJoystickKnob(limitedDelta);
    }

    getJoystickCenter(rectangle) {
        return {
            x: rectangle.left + rectangle.width / 2,
            y: rectangle.top + rectangle.height / 2
        };
    }

    getLimitedDelta(event, center) {
        const delta = this.getPointerDelta(event, center);
        const distance = Math.hypot(delta.x, delta.y);

        if (distance <= GAME_CONFIG.mobileJoystickMaxDistance) {
            return delta;
        }

        return this.getNormalizedDelta(delta, distance);
    }

    getPointerDelta(event, center) {
        return {
            x: event.clientX - center.x,
            y: event.clientY - center.y
        };
    }

    getNormalizedDelta(delta, distance) {
        const factor = GAME_CONFIG.mobileJoystickMaxDistance / distance;

        return {
            x: delta.x * factor,
            y: delta.y * factor
        };
    }

    updateMobileMovement(delta) {
        const maxDistance = GAME_CONFIG.mobileJoystickMaxDistance;
        this.keyboard.setMobileMovement(delta.x / maxDistance, delta.y / maxDistance);
    }

    moveJoystickKnob(delta) {
        this.joystickKnob.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
    }

    resetJoystickKnob() {
        this.joystickKnob.style.transform = 'translate(0, 0)';
    }

    bindAttackButtons() {
        const attackButtons = document.querySelectorAll('[data-mobile-action]');
        attackButtons.forEach((button) => this.bindAttackButton(button));
    }

    bindAttackButton(button) {
        button.addEventListener('pointerdown', (event) => this.startAttack(event, button));
        button.addEventListener('pointerup', (event) => this.stopAttack(event, button));
        button.addEventListener('pointercancel', (event) => this.stopAttack(event, button));
        button.addEventListener('pointerleave', (event) => this.stopAttack(event, button));
    }

    startAttack(event, button) {
        event.preventDefault();
        this.keyboard.setMobileAction(button.dataset.mobileAction, true);
    }

    stopAttack(event, button) {
        event.preventDefault();
        this.keyboard.setMobileAction(button.dataset.mobileAction, false);
    }
}