import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** Creates a keyboard with observable browser lifecycle listeners. */
function createKeyboardEnvironment() {
    const windowListeners = {};
    const documentListeners = {};
    const document = {
        hidden: false,
        addEventListener: (type, listener) => {
            documentListeners[type] = listener;
        }
    };
    const window = {
        addEventListener: (type, listener) => {
            windowListeners[type] = listener;
        }
    };
    const context = createScriptContext({ document, window });
    loadProjectScripts(
        context,
        ['js/config/game-config.js', 'js/input/keyboard.class.js'],
        'globalThis.KeyboardExport = Keyboard;'
    );
    return {
        keyboard: new context.KeyboardExport(),
        document,
        documentListeners,
        windowListeners
    };
}

test('desktop movement supports arrows and WASD', () => {
    const { keyboard } = createKeyboardEnvironment();
    keyboard.setKeyState('ArrowLeft', true);
    keyboard.setKeyState('KeyW', true);
    assert.equal(keyboard.isMovingLeft(), true);
    assert.equal(keyboard.isMovingUp(), true);
    assert.equal(keyboard.isMovingRight(), false);
});

test('all three attacks map to their documented keys', () => {
    const { keyboard } = createKeyboardEnvironment();
    keyboard.setKeyState('KeyE', true);
    keyboard.setKeyState('Space', true);
    keyboard.setKeyState('KeyF', true);
    assert.equal(keyboard.isFinSlapPressed(), true);
    assert.equal(keyboard.isBubbleAttackPressed(), true);
    assert.equal(keyboard.isPoisonAttackPressed(), true);
});

test('browser focus loss clears every active input', () => {
    const { keyboard, windowListeners } = createKeyboardEnvironment();
    keyboard.setKeyState('KeyD', true);
    keyboard.setMobileMovement(1, 0);
    keyboard.setMobileAction('slap', true);
    windowListeners.blur();
    assert.equal(keyboard.isMovingRight(), false);
    assert.equal(keyboard.isFinSlapPressed(), false);
});
