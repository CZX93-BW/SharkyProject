import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

const context = createScriptContext();

loadProjectScripts(
    context,
    ['js/game/game-renderer.class.js'],
    'this.GameRendererExport = GameRenderer;'
);

test('normal rendering skips hitboxes and debug information', () => {
    const calls = createDebugCalls();
    const renderer = createDebugRenderer(calls);

    renderer.drawDebugLayer(
        { debugMode: false },
        {},
        {}
    );

    assert.deepEqual(calls, {
        world: 0,
        information: 0
    });
});

test('debug mode renders hitboxes and debug information', () => {
    const calls = createDebugCalls();
    const renderer = createDebugRenderer(calls);

    renderer.drawDebugLayer(
        { debugMode: true },
        {},
        {}
    );

    assert.deepEqual(calls, {
        world: 1,
        information: 1
    });
});

/** @returns {Object} Initial debug rendering counters. */
function createDebugCalls() {
    return {
        world: 0,
        information: 0
    };
}

/**
 * @param {Object} calls - Observable debug rendering counters.
 * @returns {GameRenderer} Renderer with isolated debug collaborators.
 */
function createDebugRenderer(calls) {
    const renderer = Object.create(
        context.GameRendererExport.prototype
    );

    renderer.drawDebugWorldLayer = () => calls.world++;
    renderer.drawDebugInfo = () => calls.information++;

    return renderer;
}