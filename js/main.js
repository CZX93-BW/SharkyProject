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
    const keyboard = new Keyboard(() => sharkyGame?.gameState.status === 'playing');
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
    const touchLandscape = window.matchMedia('(pointer: coarse) and (orientation: landscape)');
    const resize = () => updateCanvasViewport(canvas, touchLandscape.matches);
    resize();
    window.addEventListener('resize', resize);
    touchLandscape.addEventListener?.('change', resize);
}

/**
 * @param {HTMLCanvasElement} canvas - Responsive gameplay canvas.
 * @param {boolean} fillViewport - Whether the touch layout fills the window.
 */
function updateCanvasViewport(canvas, fillViewport) {
    const nextWidth = getCanvasViewportWidth(fillViewport);
    if (canvas.width !== nextWidth) {
        canvas.width = nextWidth;
    }
    if (canvas.height !== GAME_CONFIG.canvasHeight) {
        canvas.height = GAME_CONFIG.canvasHeight;
    }
}

/**
 * @param {boolean} fillViewport - Whether the touch layout fills the window.
 * @returns {number} Logical width for the active game layout.
 */
function getCanvasViewportWidth(fillViewport) {
    if (!fillViewport) {
        return GAME_CONFIG.canvasWidth;
    }
    const ratio = window.innerWidth / Math.max(1, window.innerHeight);
    return Math.round(GAME_CONFIG.canvasHeight * ratio);
}

/** Creates managers shared by the game and interface controllers. */
function createCoreManagers() {
    audioManager = new AudioManager(() => sharkyGame?.gameState.status === 'paused');
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
