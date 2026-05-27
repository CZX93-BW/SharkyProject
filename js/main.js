'use strict';

let sharkyGame;
let audioManager;
let storyNarrator;
let screenManager;
let uiController;

window.addEventListener('load', initializeApplication);

function initializeApplication() {
    const keyboard = new Keyboard();
    const canvas = document.getElementById('gameCanvas');

    createCoreManagers();
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