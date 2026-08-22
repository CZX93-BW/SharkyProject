'use strict';

class GameClock {
    /** Creates a monotonic game clock based on browser clocks. */
    constructor() {
        this.isPaused = false;
        this.pausedDateTime = 0;
        this.pausedAnimationTime = 0;
        this.totalDatePause = 0;
        this.totalAnimationPause = 0;
    }

    /** Returns gameplay time excluding every completed pause. */
    now() {
        const realTime = this.isPaused ? this.pausedDateTime : Date.now();
        return realTime - this.totalDatePause;
    }

    /** Returns animation time excluding every completed pause. */
    animationNow() {
        const realTime = this.isPaused ?
            this.pausedAnimationTime : performance.now();
        return realTime - this.totalAnimationPause;
    }

    /** Freezes both internal clocks once. */
    pause() {
        if (this.isPaused) {
            return;
        }

        this.isPaused = true;
        this.pausedDateTime = Date.now();
        this.pausedAnimationTime = performance.now();
    }

    /** Continues both clocks without counting the paused duration. */
    resume() {
        if (!this.isPaused) {
            return;
        }

        this.addCompletedPause();
        this.isPaused = false;
    }

    /** Adds the current pause to both accumulated offsets. */
    addCompletedPause() {
        this.totalDatePause += Date.now() - this.pausedDateTime;
        this.totalAnimationPause += performance.now() -
            this.pausedAnimationTime;
    }
}

const GAME_CLOCK = new GameClock();