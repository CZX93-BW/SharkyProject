import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

const context = createScriptContext();
loadProjectScripts(
    context,
    ['js/systems/collision-manager.class.js'],
    'this.CollisionManagerExport = CollisionManager;'
);

test('attacks damage only targets inside their hitbox', () => {
    const manager = createManager().manager;
    const target = createTarget(200);
    const attack = createFinSlap(0);

    manager.checkAttackTarget(attack, target);
    assert.equal(target.health, 100);

    attack.x = 190;
    manager.checkAttackTarget(attack, target);
    assert.equal(target.health, 72);
});

test('one attack cannot damage the same target twice', () => {
    const manager = createManager().manager;
    const target = createTarget(20);
    const attack = createFinSlap(0);

    manager.checkAttackTarget(attack, target);
    manager.checkAttackTarget(attack, target);

    assert.equal(target.health, 72);
});

test('coin collection updates inventory and sound immediately', () => {
    const environment = createManager();
    const collectible = createCollectible('coin');
    const gameState = createCollectibleState(collectible, true);

    environment.manager.checkPlayerCollectibleCollisions(gameState);

    assert.equal(gameState.coins, 1);
    assert.equal(collectible.isCollected, true);
    assert.deepEqual(environment.sounds, ['coin']);
});

test('full poison inventory leaves the bottle available', () => {
    const environment = createManager();
    const collectible = createCollectible('poisonBottle');
    const gameState = createCollectibleState(collectible, false);

    environment.manager.checkPlayerCollectibleCollisions(gameState);

    assert.equal(collectible.isCollected, false);
    assert.deepEqual(environment.sounds, []);
});

/** @returns {Object} Collision manager and recorded sound names. */
function createManager() {
    const sounds = [];
    const audioManager = {
        playSound: (soundName) => sounds.push(soundName)
    };

    return {
        sounds,
        manager: new context.CollisionManagerExport(audioManager)
    };
}

/**
 * @param {number} x - Horizontal target position.
 * @returns {Object} Damageable rectangular attack target.
 */
function createTarget(x) {
    return {
        x,
        y: 0,
        width: 40,
        height: 40,
        health: 100,
        isDefeated: false,
        takeDamage(damage) {
            this.health -= damage;
        }
    };
}

/**
 * @param {number} x - Horizontal attack position.
 * @returns {Object} Fin Slap attack with per-target hit tracking.
 */
function createFinSlap(x) {
    const hitTargets = new Set();

    return {
        x,
        y: 0,
        width: 40,
        height: 40,
        type: 'finSlap',
        damage: 28,
        hasHit: (target) => hitTargets.has(target),
        registerHit: (target) => hitTargets.add(target)
    };
}

/**
 * @param {string} type - Collectible type identifier.
 * @returns {Object} Collectible inside the player hitbox.
 */
function createCollectible(type) {
    return {
        x: 10,
        y: 10,
        width: 20,
        height: 20,
        type,
        value: 1,
        isCollected: false,
        collect() {
            this.isCollected = true;
        }
    };
}

/**
 * @param {Object} collectible - Collectible used by the test.
 * @param {boolean} canCollectPoison - Poison inventory acceptance state.
 * @returns {Object} Minimal state used for collectible collision tests.
 */
function createCollectibleState(collectible, canCollectPoison) {
    return {
        player: {
            x: 0,
            y: 0,
            width: 50,
            height: 50
        },
        activeLevel: {
            collectibles: [collectible]
        },
        coins: 0,
        canCollectPoisonBottle: () => canCollectPoison,
        collectCoin(value) {
            this.coins += value;
        },
        collectPoisonBottle: () => canCollectPoison
    };
}