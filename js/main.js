'use strict';

let sharkyGame;
let audioManager;
let storyNarrator;
let screenManager;
let mainMenuController;
let displaySettingsController;
let uiController;

window.addEventListener('load', initializeApplication);

/** Creates and connects every application controller after the page loads. */
function initializeApplication() {
    const keyboard = new Keyboard();
    const canvas = document.getElementById('gameCanvas');

    createCoreManagers();
    initializeMainMenu();
    initializeDisplaySettings();
    new MobileControls(keyboard);
    sharkyGame = createGame(canvas, keyboard);
    createUiController();
    runDebugChecklist();
}

/** Creates managers shared by the game and interface controllers. */
function createCoreManagers() {
    audioManager = new AudioManager();
    storyNarrator = new StoryNarrator('storyText');
    screenManager = new ScreenManager();
}

/** Initializes the interactive main menu background. */
function initializeMainMenu() {
    mainMenuController = new MainMenuController();
    mainMenuController.initialize();
}

/** Creates and initializes persistent display settings. */
function initializeDisplaySettings() {
    displaySettingsController = new DisplaySettingsController();
    displaySettingsController.initialize();
}

/**
 * @param {HTMLCanvasElement} canvas - Canvas used to render the game.
 * @param {Keyboard} keyboard - Current keyboard input controller.
 * @returns {Game} Configured game controller.
 */
function createGame(canvas, keyboard) {
    return new Game(
        canvas,
        keyboard,
        handleGameStatusUpdate,
        audioManager
    );
}

/** Creates and initializes the central interface controller. */
function createUiController() {
    uiController = new UiController(
        sharkyGame,
        audioManager,
        storyNarrator,
        screenManager
    );

    uiController.initialize();
}

/** @param {GameState} gameState - State emitted by the active game. */
function handleGameStatusUpdate(gameState) {
    if (uiController) {
        uiController.handleGameStatusUpdate(gameState);
    }
}

/** Runs browser-visible project checks when debug mode is active. */
function runDebugChecklist() {
    const debugChecklist = new DebugChecklist(
        sharkyGame,
        audioManager,
        storyNarrator
    );

    debugChecklist.run();
}