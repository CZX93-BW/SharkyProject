'use strict';

/**
 * Provides gameplay and animation timestamps that exclude paused periods.
 * The clock keeps game logic deterministic across pause and resume cycles.
 */
class GameClock {
    /**
     * Creates an active game clock without accumulated pause durations.
     */
    constructor() {
        this.isPaused = false;
        this.pausedDateTime = 0;
        this.pausedAnimationTime = 0;
        this.totalDatePause = 0;
        this.totalAnimationPause = 0;
    }

    /**
     * Returns gameplay time excluding active and completed pauses.
     *
     * @returns {number} Gameplay timestamp in milliseconds.
     */
    now() {
        const realTime = this.isPaused
            ? this.pausedDateTime
            : Date.now();

        return realTime - this.totalDatePause;
    }

    /**
     * Returns animation time excluding active and completed pauses.
     *
     * @returns {number} Animation timestamp in milliseconds.
     */
    animationNow() {
        const realTime = this.isPaused
            ? this.pausedAnimationTime
            : performance.now();

        return realTime - this.totalAnimationPause;
    }

    /**
     * Freezes the gameplay and animation timestamps once.
     *
     * @returns {void}
     */
    pause() {
        if (this.isPaused) {
            return;
        }

        this.isPaused = true;
        this.pausedDateTime = Date.now();
        this.pausedAnimationTime = performance.now();
    }

    /**
     * Resumes both clocks without counting the paused duration.
     *
     * @returns {void}
     */
    resume() {
        if (!this.isPaused) {
            return;
        }

        this.addCompletedPause();
        this.isPaused = false;
    }

    /**
     * Adds the current pause duration to both accumulated offsets.
     *
     * @returns {void}
     */
    addCompletedPause() {
        this.totalDatePause += Date.now() - this.pausedDateTime;
        this.totalAnimationPause +=
            performance.now() - this.pausedAnimationTime;
    }
}

/** @type {GameClock} Shared clock instance used by the complete game. */
const GAME_CLOCK = new GameClock();