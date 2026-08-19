'use strict';

let sharkyGame;
let audioManager;
let storyNarrator;
let screenManager;
let displaySettingsController;
let uiController;

window.addEventListener('load', initializeApplication);

function initializeApplication() {
    const keyboard = new Keyboard();
    const canvas = document.getElementById('gameCanvas');

    createCoreManagers();
    initializeDisplaySettings();
    new MobileControls(keyboard);
    sharkyGame = createGame(canvas, keyboard);
    createUiController();
    runDebugChecklist();
}

function createCoreManagers() {
    audioManager = new AudioManager();
    storyNarrator = new StoryNarrator('storyText');
    screenManager = new ScreenManager();
}

/** Creates and initializes persistent display settings. */
function initializeDisplaySettings() {
    displaySettingsController = new DisplaySettingsController();
    displaySettingsController.initialize();
}

function createGame(canvas, keyboard) {
    return new Game(
        canvas,
        keyboard,
        handleGameStatusUpdate,
        audioManager
    );
}

function createUiController() {
    uiController = new UiController(
        sharkyGame,
        audioManager,
        storyNarrator,
        screenManager
    );

    uiController.initialize();
}

function handleGameStatusUpdate(gameState) {
    if (uiController) {
        uiController.handleGameStatusUpdate(gameState);
    }
}

function runDebugChecklist() {
    const debugChecklist = new DebugChecklist(
        sharkyGame,
        audioManager,
        storyNarrator
    );

    debugChecklist.run();
}