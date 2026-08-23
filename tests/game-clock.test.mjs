import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** @returns {Object} Controllable clock and time-source interface. */
function createClockEnvironment() {
    const timeSource = createTimeSource();
    const context = createClockContext(timeSource);

    loadProjectScripts(
        context,
        ['js/core/game-clock.class.js'],
        'globalThis.GameClockExport = GameClock;'
    );

    return createClockControls(context.GameClockExport, timeSource);
}

/** @returns {Object} Mutable wall-clock and animation timestamps. */
function createTimeSource() {
    return {
        dateTime: 1000,
        animationTime: 100
    };
}

/**
 * @param {Object} timeSource - Mutable source timestamps.
 * @returns {vm.Context} Script context backed by the source timestamps.
 */
function createClockContext(timeSource) {
    class FakeDate extends Date {
        static now() {
            return timeSource.dateTime;
        }
    }

    return createScriptContext({
        Date: FakeDate,
        performance: { now: () => timeSource.animationTime }
    });
}

/**
 * @param {Function} GameClock - Game clock constructor.
 * @param {Object} timeSource - Mutable source timestamps.
 * @returns {Object} Clock and method for advancing source time.
 */
function createClockControls(GameClock, timeSource) {
    return {
        clock: new GameClock(),
        advance(dateDelta, animationDelta) {
            timeSource.dateTime += dateDelta;
            timeSource.animationTime += animationDelta;
        }
    };
}

test('gameplay time remains frozen during pause', () => {
    const environment = createClockEnvironment();
    environment.advance(250, 25);
    environment.clock.pause();
    environment.advance(5000, 500);

    assert.equal(environment.clock.now(), 1250);
    assert.equal(environment.clock.animationNow(), 125);
});

test('resume excludes the completed pause duration', () => {
    const environment = createClockEnvironment();
    environment.advance(250, 25);
    environment.clock.pause();
    environment.advance(5000, 500);
    environment.clock.resume();
    environment.advance(100, 10);

    assert.equal(environment.clock.now(), 1350);
    assert.equal(environment.clock.animationNow(), 135);
});