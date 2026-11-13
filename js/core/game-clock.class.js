'use strict';

/** Measures active simulation time for gameplay timers and sprite animations. */
class GameClock {
    /** Preserves the timestamp range used by cooldowns at the start of a run. */
    constructor() {
        this.startedAt = Date.now();
        this.elapsedMs = 0;
        this.isPaused = false;
    }

    /** @param {number} milliseconds - Duration of the next simulation step. */
    advance(milliseconds) {
        if (!this.isPaused) {
            this.elapsedMs += milliseconds;
        }
    }

    /** @returns {number} Gameplay timestamp in milliseconds. */
    now() {
        return this.startedAt + this.elapsedMs;
    }

    /** @returns {number} Active animation time in milliseconds. */
    animationNow() {
        return this.elapsedMs;
    }

    /** Freezes gameplay and animation timers. */
    pause() {
        this.isPaused = true;
    }

    /** Allows subsequent simulation steps to advance time again. */
    resume() {
        this.isPaused = false;
    }
}

/** @type {GameClock} Shared clock instance used by the complete game. */
const GAME_CLOCK = new GameClock();