import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

const context = createScriptContext();
loadProjectScripts(context, ['js/core/game-clock.class.js'], 'this.Clock = GameClock;');

test('gameplay time remains frozen during pause', () => {
    const clock = new context.Clock();
    const start = clock.now();
    clock.advance(25);
    clock.pause();
    clock.advance(500);

    assert.equal(clock.now() - start, 25);
    assert.equal(clock.animationNow(), 25);
});

test('resume excludes the completed pause duration', () => {
    const clock = new context.Clock();
    const start = clock.now();
    clock.advance(25);
    clock.pause();
    clock.advance(500);
    clock.resume();
    clock.advance(10);

    assert.equal(clock.now() - start, 35);
    assert.equal(clock.animationNow(), 35);
});