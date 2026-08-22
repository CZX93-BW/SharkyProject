import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** Creates touch-control dependencies for one viewport scenario. */
function createMobileEnvironment(options) {
    const appliedStates = [];
    const mediaQuery = createMediaQuery(options.hasCoarsePointer);
    const elements = createControlElements();
    const document = createDocument(elements, appliedStates);
    const window = createWindow(options.width, mediaQuery);
    const navigator = { maxTouchPoints: options.touchPoints };
    const keyboard = createKeyboardStub();
    const context = createScriptContext({ document, navigator, window });
    loadProjectScripts(
        context,
        ['js/config/game-config.js', 'js/input/mobile-controls.class.js'],
        'globalThis.MobileControlsExport = MobileControls;'
    );
    return {
        controls: new context.MobileControlsExport(keyboard),
        appliedStates
    };
}

/** Creates a minimal media query object. */
function createMediaQuery(matches) {
    return {
        matches,
        addEventListener: () => {}
    };
}

/** Creates the joystick elements required by the controller. */
function createControlElements() {
    return {
        mobileJoystick: {
            addEventListener: () => {},
            clientWidth: 116,
            setPointerCapture: () => {}
        },
        mobileJoystickKnob: {
            addEventListener: () => {},
            clientWidth: 46,
            style: {}
        }
    };
}

/** Creates the document surface used during availability detection. */
function createDocument(elements, appliedStates) {
    return {
        documentElement: {
            classList: {
                toggle: (name, state) => appliedStates.push({ name, state })
            }
        },
        getElementById: (id) => elements[id],
        querySelectorAll: () => []
    };
}

/** Creates the viewport and pointer event surface. */
function createWindow(width, mediaQuery) {
    return {
        innerWidth: width,
        addEventListener: () => {},
        matchMedia: () => mediaQuery
    };
}

/** Creates the shared input methods used by mobile controls. */
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
    assert.equal(environment.controls.shouldEnableTouchControls(), true);
    assert.equal(environment.appliedStates.at(-1).state, true);
});

test('touch controls remain hidden on desktop devices', () => {
    const environment = createMobileEnvironment({
        width: 900,
        touchPoints: 0,
        hasCoarsePointer: false
    });
    assert.equal(environment.controls.shouldEnableTouchControls(), false);
    assert.equal(environment.appliedStates.at(-1).state, false);
});

test('touch controls remain hidden above the supported width', () => {
    const environment = createMobileEnvironment({
        width: 1280,
        touchPoints: 5,
        hasCoarsePointer: true
    });
    assert.equal(environment.controls.shouldEnableTouchControls(), false);
});
