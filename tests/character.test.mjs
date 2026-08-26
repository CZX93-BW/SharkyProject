import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** @returns {Object} Character and controllable gameplay time. */
function createCharacterEnvironment() {
    const timeSource = { dateTime: 1000, animationTime: 100 };
    const context = createCharacterContext(timeSource);
    loadCharacterScripts(context);
    return {
        character: new context.CharacterExport(),
        advance: (milliseconds) => advanceTime(timeSource, milliseconds)
    };
}

/** @param {Object} timeSource - Mutable time-source values. */
function createCharacterContext(timeSource) {
    class FakeDate extends Date {
        static now() {
            return timeSource.dateTime;
        }
    }

    class FakeImage {
        constructor() {
            this.complete = false;
            this.naturalWidth = 0;
        }
    }

    return createScriptContext({
        Date: FakeDate,
        Image: FakeImage,
        performance: { now: () => timeSource.animationTime }
    });
}

/** @param {vm.Context} context - Character test context. */
function loadCharacterScripts(context) {
    loadProjectScripts(
        context,
        [
            'js/config/game-config.js',
            'js/config/asset-config.js',
            'js/core/game-clock.class.js',
            'js/core/drawable-object.class.js',
            'js/core/movable-object.class.js',
            'js/core/animated-drawable-object.class.js',
            'js/entities/player/character.class.js'
        ],
        'globalThis.CharacterExport = Character;'
    );
}

/**
 * @param {Object} timeSource - Mutable time-source values.
 * @param {number} milliseconds - Time increment.
 */
function advanceTime(timeSource, milliseconds) {
    timeSource.dateTime += milliseconds;
    timeSource.animationTime += milliseconds;
}

/** @returns {Object} Inactive keyboard interface. */
function createKeyboard() {
    return {
        isMovingLeft: () => false,
        isMovingRight: () => false,
        isMovingUp: () => false,
        isMovingDown: () => false
    };
}

/** @returns {Object} Bounds containing the complete character. */
function createBounds() {
    return {
        left: 0,
        right: 960,
        top: 0,
        bottom: 540
    };
}

test('character enters long idle after fifteen seconds', () => {
    const environment = createCharacterEnvironment();
    const keyboard = createKeyboard();

    environment.advance(14999);
    environment.character.update(keyboard, createBounds());
    assert.equal(environment.character.currentAnimation, 'idle');

    environment.advance(1);
    environment.character.update(keyboard, createBounds());
    assert.equal(environment.character.currentAnimation, 'longIdle');
});

test('movement immediately leaves long idle and resets its timer', () => {
    const environment = createCharacterEnvironment();

    environment.advance(15000);
    environment.character.update(createKeyboard(), createBounds());
    assert.equal(environment.character.currentAnimation, 'longIdle');

    const movingKeyboard = createKeyboard();
    movingKeyboard.isMovingRight = () => true;
    environment.character.update(movingKeyboard, createBounds());
    assert.equal(environment.character.currentAnimation, 'swim');

    environment.character.update(createKeyboard(), createBounds());
    assert.equal(environment.character.currentAnimation, 'idle');
});

test('attacking resets the long-idle timer', () => {
    const environment = createCharacterEnvironment();

    environment.advance(14900);
    environment.character.startFinSlap();
    environment.character.activeAttackAnimation = '';

    environment.advance(200);
    environment.character.update(createKeyboard(), createBounds());
    assert.equal(environment.character.currentAnimation, 'idle');
});