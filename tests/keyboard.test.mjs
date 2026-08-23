import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** @returns {Object} Keyboard with observable lifecycle listeners. */
function createKeyboardEnvironment() {
    const listeners = createLifecycleListeners();
    const browser = createKeyboardBrowser(listeners);
    const context = createScriptContext(browser);

    loadProjectScripts(
        context,
        ['js/config/game-config.js', 'js/input/keyboard.class.js'],
        'globalThis.KeyboardExport = Keyboard;'
    );

    return {
        keyboard: new context.KeyboardExport(),
        ...browser,
        ...listeners
    };
}

/** @returns {Object} Listener maps for window and document events. */
function createLifecycleListeners() {
    return {
        windowListeners: {},
        documentListeners: {}
    };
}

/**
 * @param {Object} listeners - Window and document listener maps.
 * @returns {Object} Minimal document and window implementations.
 */
function createKeyboardBrowser(listeners) {
    const document = {
        hidden: false,
        addEventListener: (type, listener) => {
            listeners.documentListeners[type] = listener;
        }
    };
    const window = {
        addEventListener: (type, listener) => {
            listeners.windowListeners[type] = listener;
        }
    };

    return { document, window };
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