import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** @returns {Object} Character and controllable gameplay time. */
function createCharacterEnvironment() {
    const context = createScriptContext({ Image: class {} });
    loadCharacterScripts(context);
    return {
        character: new context.CharacterExport(),
        advance: (milliseconds) => context.clock.advance(milliseconds)
    };
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
        'globalThis.CharacterExport = Character; globalThis.clock = GAME_CLOCK;'
    );
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