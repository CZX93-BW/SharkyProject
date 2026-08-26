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
        'orientationNotice',
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
    const orientationCss = readProjectFile('styles/orientation.css');
    const menuCss = readProjectFile('styles/menu-screen.css');

    assert.match(responsiveCss, /orientation:\s*landscape/);
    assert.match(responsiveCss, /prefers-reduced-motion:\s*reduce/);
    assert.match(menuCss, /orientation:\s*landscape/);
    assert.match(orientationCss, /orientation:\s*portrait/);
    assert.match(orientationCss, /html\.has-touch-controls/);
});

test('browser scripts contain no console output calls', () => {
    const html = readProjectFile('index.html');
    const scriptPaths = extractBrowserScriptPaths(html);

    scriptPaths.forEach((scriptPath) => {
        const script = readProjectFile(scriptPath);
        assert.doesNotMatch(script, /console\s*\./, scriptPath);
    });
});

test('main-menu panels close only through their backdrop', () => {
    const panel = createFakePanel();
    const document = createPanelDocument(panel);
    const context = createScriptContext({ document });

    loadProjectScripts(
        context,
        ['js/ui/ui-controller.class.js'],
        'this.UiController = UiController;'
    );

    const controller = new context.UiController({}, {}, {}, {});
    let closeCount = 0;
    controller.closeMainMenuPanels = () => closeCount++;
    controller.bindPanelBackdropListeners();

    panel.click(panel);
    panel.click({});

    assert.equal(closeCount, 1);
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

/** @returns {Object} Minimal clickable panel implementation. */
function createFakePanel() {
    let clickListener = null;

    return {
        addEventListener: (type, callback) => {
            clickListener = callback;
        },
        click(target) {
            clickListener({
                target,
                currentTarget: this
            });
        }
    };
}

/**
 * @param {Object} panel - Main-menu panel element.
 * @returns {Object} Minimal panel document implementation.
 */
function createPanelDocument(panel) {
    return {
        querySelectorAll: (selector) => {
            return selector === '.main-menu-panel' ? [panel] : [];
        }
    };
}

/**
 * @param {string} html - Interface HTML source.
 * @returns {string[]} Local browser script paths without cache parameters.
 */
function extractBrowserScriptPaths(html) {
    return [...html.matchAll(/<script\s+src="([^"]+)"/g)]
        .map((match) => match[1].split('?')[0])
        .filter((path) => path.startsWith('js/'));
}