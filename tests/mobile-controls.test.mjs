import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/**
 * @param {Object} options - Viewport and touch-capability settings.
 * @returns {Object} Mobile controls and recorded root-class changes.
 */
function createMobileEnvironment(options) {
    const environment = createMobileDependencies(options);
    const context = createScriptContext(environment.browser);

    loadProjectScripts(
        context,
        [
            'js/config/game-config.js',
            'js/input/mobile-controls.class.js'
        ],
        'globalThis.MobileControlsExport = MobileControls;'
    );

    return {
        controls: new context.MobileControlsExport(environment.keyboard),
        appliedStates: environment.appliedStates,
        elements: environment.elements
    };
}

/**
 * @param {Object} options - Viewport and touch-capability settings.
 * @returns {Object} Browser, keyboard, and state recorder dependencies.
 */
function createMobileDependencies(options) {
    const appliedStates = [];
    const mediaQuery = createMediaQuery(options.hasCoarsePointer);
    const elements = createControlElements();
    const document = createDocument(elements, appliedStates);
    const window = createWindow(options.width, mediaQuery);
    const navigator = { maxTouchPoints: options.touchPoints };
    const keyboard = createKeyboardStub();

    return {
        appliedStates,
        browser: { document, navigator, window },
        elements,
        keyboard
    };
}

/**
 * @param {boolean} matches - Whether the media query currently matches.
 * @returns {Object} Minimal media query object.
 */
function createMediaQuery(matches) {
    return {
        matches,
        addEventListener: () => {}
    };
}

/** @returns {Object} Joystick elements required by the controller. */
function createControlElements() {
    return {
        mobileJoystick: createEventElement({
            clientWidth: 116,
            setPointerCapture: () => {}
        }),
        mobileJoystickKnob: createEventElement({
            clientWidth: 46,
            style: {}
        }),
        mobileAttackButton: createEventElement({
            dataset: { mobileAction: 'slap' }
        })
    };
}

/**
 * @param {Object} values - Element properties.
 * @returns {Object} Element with recorded event listeners.
 */
function createEventElement(values) {
    const listeners = {};

    return {
        ...values,
        listeners,
        addEventListener: (type, callback) => {
            listeners[type] = callback;
        }
    };
}

/**
 * @param {Object} elements - Elements addressable by identifier.
 * @param {Object[]} appliedStates - Recorded root-class changes.
 * @returns {Object} Minimal document implementation.
 */
function createDocument(elements, appliedStates) {
    return {
        documentElement: {
            classList: {
                toggle: (name, state) => {
                    appliedStates.push({ name, state });
                }
            }
        },
        getElementById: (id) => elements[id],
        querySelectorAll: (selector) => {
            return selector === '[data-mobile-action]' ?
                [elements.mobileAttackButton] : [];
        }
    };
}

/**
 * @param {number} width - Current viewport width.
 * @param {Object} mediaQuery - Coarse-pointer media query.
 * @returns {Object} Minimal window implementation.
 */
function createWindow(width, mediaQuery) {
    return {
        innerWidth: width,
        addEventListener: () => {},
        matchMedia: () => mediaQuery
    };
}

/** @returns {Object} Shared input methods used by mobile controls. */
function createKeyboardStub() {
    return {
        resetMobileMovement: () => {},
        setMobileAction: () => {},
        setMobileMovement: () => {}
    };
}

test('touch controls activate on a suitable mobile viewport', () => {
    const environment = createMobileEnvironment({
        width: 900,
        touchPoints: 5,
        hasCoarsePointer: true
    });

    assert.equal(
        environment.controls.shouldEnableTouchControls(),
        true
    );
    assert.equal(environment.appliedStates.at(-1).state, true);
});

test('touch controls remain hidden on desktop devices', () => {
    const environment = createMobileEnvironment({
        width: 900,
        touchPoints: 0,
        hasCoarsePointer: false
    });

    assert.equal(
        environment.controls.shouldEnableTouchControls(),
        false
    );
    assert.equal(environment.appliedStates.at(-1).state, false);
});

test('touch controls remain hidden above the supported width', () => {
    const environment = createMobileEnvironment({
        width: 1280,
        touchPoints: 5,
        hasCoarsePointer: true
    });

    assert.equal(
        environment.controls.shouldEnableTouchControls(),
        false
    );
});

test('touch controls suppress context menus', () => {
    const environment = createMobileEnvironment({
        width: 900,
        touchPoints: 5,
        hasCoarsePointer: true
    });
    let preventionCount = 0;
    const event = {
        preventDefault: () => preventionCount++
    };

    environment.elements.mobileJoystick.listeners.contextmenu(event);
    environment.elements.mobileAttackButton.listeners.contextmenu(event);

    assert.equal(preventionCount, 2);
});