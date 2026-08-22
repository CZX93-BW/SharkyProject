import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** Creates a controllable game clock test environment. */
function createClockEnvironment() {
    let dateTime = 1000;
    let animationTime = 100;
    class FakeDate extends Date {
        static now() {
            return dateTime;
        }
    }
    const context = createScriptContext({
        Date: FakeDate,
        performance: { now: () => animationTime }
    });
    loadProjectScripts(
        context,
        ['js/core/game-clock.class.js'],
        'globalThis.GameClockExport = GameClock;'
    );
    return createClockControls(context.GameClockExport, {
        get dateTime() { return dateTime; },
        set dateTime(value) { dateTime = value; },
        get animationTime() { return animationTime; },
        set animationTime(value) { animationTime = value; }
    });
}

/** Wraps one clock and its controllable source values. */
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
