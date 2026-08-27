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
    initializeCanvasViewport(canvas);
    sharkyGame = createGame(canvas, keyboard);
    applyDebugModeState();
    createUiController();
    runDebugChecklist();
}

/** @param {HTMLCanvasElement} canvas - Responsive gameplay canvas. */
function initializeCanvasViewport(canvas) {
    updateCanvasViewport(canvas);
    window.addEventListener('resize', () => {
        updateCanvasViewport(canvas);
    });
}

/** @param {HTMLCanvasElement} canvas - Canvas to resize safely. */
function updateCanvasViewport(canvas) {
    const nextWidth = getCanvasViewportWidth();
    if (canvas.width !== nextWidth) {
        canvas.width = nextWidth;
    }
    if (canvas.height !== GAME_CONFIG.canvasHeight) {
        canvas.height = GAME_CONFIG.canvasHeight;
    }
}

/** @returns {number} Logical width matching the active viewport ratio. */
function getCanvasViewportWidth() {
    if (!usesTouchLandscapeViewport()) {
        return GAME_CONFIG.canvasWidth;
    }
    const ratio = window.innerWidth / Math.max(1, window.innerHeight);
    return Math.round(GAME_CONFIG.canvasHeight * ratio);
}

/** @returns {boolean} Whether mobile landscape rendering is active. */
function usesTouchLandscapeViewport() {
    const root = document.documentElement;
    return root.classList.contains('has-touch-controls') &&
        window.matchMedia('(orientation: landscape)').matches;
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

/** Synchronizes document-level debug visibility with the game state. */
function applyDebugModeState() {
    document.documentElement.classList.toggle(
        'is-debug-mode',
        sharkyGame.gameState.debugMode
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
