import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

const context = createScriptContext();
loadProjectScripts(
    context,
    ['js/game/game.class.js'],
    'this.GameExport = Game;'
);

test('dead players cannot enter the active movement update', () => {
    const calls = { defeat: 0, active: 0 };
    const game = createDeadPlayerGame(calls);
    game.update();

    assert.equal(calls.defeat, 1);
    assert.equal(calls.active, 0);
});

test('defeat animation does not change the player position', () => {
    const player = createDefeatedPlayer(false);
    const game = createDefeatSequenceGame(player);
    game.updateDefeatSequence();

    assert.deepEqual(
        { x: player.x, y: player.y },
        { x: 140, y: 220 }
    );
    assert.equal(player.velocityWasReset, true);
    assert.equal(player.animationWasUpdated, true);
});

test('restart prepares the current level without reloading the page', () => {
    const calls = { cancel: 0, restart: 0, prepare: 0 };
    const game = createRestartableGame(calls);
    game.restart();

    assert.deepEqual(
        calls,
        { cancel: 1, restart: 1, prepare: 1 }
    );
});

/**
 * @param {Object} calls - Observable update counters.
 * @returns {Game} Game configured with an already defeated player.
 */
function createDeadPlayerGame(calls) {
    const game = Object.create(context.GameExport.prototype);
    game.gameState = createRunningState();
    game.updateDefeatSequence = () => calls.defeat++;
    game.updateActiveGame = () => calls.active++;
    return game;
}

/** @returns {Object} Minimal active state with a defeated player. */
function createRunningState() {
    return {
        isRunning: true,
        isPaused: false,
        status: 'playing',
        player: { isAlive: () => false }
    };
}

/**
 * @param {boolean} isAnimationFinished - Simulated animation state.
 * @returns {Object} Defeated player with observable animation calls.
 */
function createDefeatedPlayer(isAnimationFinished) {
    return {
        x: 140,
        y: 220,
        velocityWasReset: false,
        animationWasUpdated: false,
        resetVelocity() {
            this.velocityWasReset = true;
        },
        updateAnimation() {
            this.animationWasUpdated = true;
        },
        isAnimationFinished: () => isAnimationFinished
    };
}

/**
 * @param {Object} player - Defeated test player.
 * @returns {Game} Game using the supplied defeated player.
 */
function createDefeatSequenceGame(player) {
    const game = Object.create(context.GameExport.prototype);
    game.gameState = {
        player,
        setGameOver: () => {}
    };
    game.audioManager = {
        stopMusic: () => {}
    };
    return game;
}

/**
 * @param {Object} calls - Observable restart counters.
 * @returns {Game} Game with observable restart collaborators.
 */
function createRestartableGame(calls) {
    const game = Object.create(context.GameExport.prototype);
    game.cancelRunningLoop = () => calls.cancel++;
    game.gameState = {
        restartCurrentLevel: () => calls.restart++
    };
    game.prepareStartedLevel = () => calls.prepare++;
    return game;
}