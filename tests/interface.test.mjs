import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts,
    readProjectFile
} from './test-helpers.mjs';

test('required game and touch controls exist in the interface', () => {
    const html = readProjectFile('index.html');
    const requiredIds = [
        'gameCanvas',
        'pausePlayButton',
        'openSettingsButton',
        'mobileJoystick',
        'mobileJoystickKnob'
    ];

    requiredIds.forEach((id) => {
        assert.match(html, new RegExp(`id="${id}"`));
    });

    ['slap', 'bubble', 'poison'].forEach((action) => {
        assert.match(
            html,
            new RegExp(`data-mobile-action="${action}"`)
        );
    });
});

test('responsive styles cover mobile landscape and reduced motion', () => {
    const responsiveCss = readProjectFile('styles/responsive.css');
    const menuCss = readProjectFile('styles/menu-screen.css');

    assert.match(responsiveCss, /orientation:\s*landscape/);
    assert.match(responsiveCss, /prefers-reduced-motion:\s*reduce/);
    assert.match(menuCss, /orientation:\s*landscape/);
});

test('compact audio button toggles music and effects together', () => {
    const button = createFakeButton();
    const document = createFakeDocument(button);
    const context = createScriptContext({ document });

    loadProjectScripts(
        context,
        ['js/ui/ui-controller.class.js'],
        'this.UiController = UiController;'
    );

    const audioManager = createFakeAudioManager();
    const controller = new context.UiController(
        {},
        audioManager,
        {},
        {}
    );

    controller.bindIngameControlButtons();
    testKeyboardToggle(button, audioManager);
    testPointerToggle(button, audioManager);
});

/**
 * @param {Object} button - Fake audio button.
 * @param {Object} audioManager - Fake audio manager.
 */
function testKeyboardToggle(button, audioManager) {
    button.click();
    assert.equal(audioManager.isMusicEnabled(), false);
    assert.equal(audioManager.isSoundEnabled(), false);

    button.click();
    assert.equal(audioManager.isMusicEnabled(), true);
    assert.equal(audioManager.isSoundEnabled(), true);
}

/**
 * @param {Object} button - Fake audio button.
 * @param {Object} audioManager - Fake audio manager.
 */
function testPointerToggle(button, audioManager) {
    button.pointerDown();
    assert.equal(audioManager.isMusicEnabled(), false);
    assert.equal(audioManager.isSoundEnabled(), false);

    button.pointerDown();
    assert.equal(audioManager.isMusicEnabled(), true);
    assert.equal(audioManager.isSoundEnabled(), true);
}

/** @returns {Object} Minimal clickable button implementation. */
function createFakeButton() {
    const listeners = {};

    return {
        addEventListener: (type, callback) => {
            listeners[type] = callback;
        },
        click: () => listeners.click({ detail: 0 }),
        pointerDown: () => {
            listeners.pointerdown({
                preventDefault: () => {}
            });
        },
        classList: {
            toggle: () => {}
        },
        setAttribute: () => {},
        textContent: '',
        value: 0
    };
}

/**
 * @param {Object} button - Compact audio button.
 * @returns {Object} Minimal document implementation.
 */
function createFakeDocument(button) {
    return {
        getElementById: (id) => {
            return id === 'musicToggleButton' ? button : null;
        },
        querySelectorAll: () => []
    };
}

/** @returns {Object} Minimal audio manager with toggleable channels. */
function createFakeAudioManager() {
    let musicEnabled = true;
    let soundEnabled = true;

    return {
        isMusicEnabled: () => musicEnabled,
        isSoundEnabled: () => soundEnabled,
        toggleMusic: () => {
            musicEnabled = !musicEnabled;
        },
        toggleSound: () => {
            soundEnabled = !soundEnabled;
        },
        getMusicVolumePercent: () => 40,
        getSoundVolumePercent: () => 40
    };
}