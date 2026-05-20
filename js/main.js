'use strict';

let sharkyGame;

window.addEventListener('load', initializeApplication);

function initializeApplication() {
    const keyboard = new Keyboard();
    const canvas = document.getElementById('gameCanvas');

    sharkyGame = new Game(canvas, keyboard, handleGameStatusUpdate);
    bindMenuButtons();
}

function bindMenuButtons() {
    bindLevelButtons();
    bindPauseButton();
    bindResumeButton();
    bindRestartButtons();
    bindMainMenuButtons();
}

function bindLevelButtons() {
    const levelButtons = document.querySelectorAll('[data-level]');
    levelButtons.forEach((button) => button.addEventListener('click', startSelectedLevel));
}

function bindPauseButton() {
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', pauseGame);
}

function bindResumeButton() {
    const resumeButton = document.getElementById('resumeButton');
    resumeButton.addEventListener('click', resumeGame);
}

function bindRestartButtons() {
    bindButton('restartButton', restartGame);
    bindButton('gameOverRestartButton', restartGame);
    bindButton('winRestartButton', restartGame);
}

function bindMainMenuButtons() {
    bindButton('mainMenuButton', returnToMainMenu);
    bindButton('gameOverMainMenuButton', returnToMainMenu);
    bindButton('winMainMenuButton', returnToMainMenu);
}

function bindButton(buttonId, callback) {
    const button = document.getElementById(buttonId);
    button.addEventListener('click', callback);
}

function startSelectedLevel(event) {
    const levelNumber = Number(event.currentTarget.dataset.level);
    sharkyGame.start(levelNumber);
    showGameScreen();
}

function pauseGame() {
    sharkyGame.pause();
    showPauseScreen();
}

function resumeGame() {
    sharkyGame.resume();
    hidePauseScreen();
}

function restartGame() {
    sharkyGame.restart();
    showGameScreen();
}

function returnToMainMenu() {
    sharkyGame.stop();
    disablePauseButton();
    showStartScreen();
}

function handleGameStatusUpdate(gameState) {
    updateGameHud(gameState);
    updateStatusScreens(gameState);
}

function updateGameHud(gameState) {
    updateLevelDisplay(gameState);
    updateHealthDisplay(gameState);
    updateCoinDisplay(gameState);
    updatePoisonDisplay(gameState);
    updateStatusDisplay(gameState);
}

function updateLevelDisplay(gameState) {
    const levelDisplay = document.getElementById('levelDisplay');
    levelDisplay.textContent = `Level: ${gameState.currentLevel}`;
}

function updateHealthDisplay(gameState) {
    const healthDisplay = document.getElementById('healthDisplay');
    healthDisplay.textContent = `Leben: ${gameState.player.health}`;
}

function updateCoinDisplay(gameState) {
    const coinDisplay = document.getElementById('coinDisplay');
    coinDisplay.textContent = `Münzen: ${gameState.coins}`;
}

function updatePoisonDisplay(gameState) {
    const poisonDisplay = document.getElementById('poisonDisplay');
    poisonDisplay.textContent = `Gift: ${gameState.poisonBottles}`;
}

function updateStatusDisplay(gameState) {
    const statusDisplay = document.getElementById('statusDisplay');
    statusDisplay.textContent = `Status: ${getReadableStatus(gameState.status)}`;
}

function getReadableStatus(status) {
    const statusTexts = {
        menu: 'Menü',
        playing: 'Läuft',
        paused: 'Pause',
        gameOver: 'Verloren',
        levelComplete: 'Geschafft'
    };

    return statusTexts[status] || 'Unbekannt';
}

function updateStatusScreens(gameState) {
    hideEndScreens();

    if (gameState.status === 'gameOver') {
        showGameOverScreen();
    }

    if (gameState.status === 'levelComplete') {
        showWinScreen();
    }
}

function showGameScreen() {
    hideStartScreen();
    hidePauseScreen();
    hideEndScreens();
    enablePauseButton();
}

function showStartScreen() {
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.remove('hidden');
    hidePauseScreen();
    hideEndScreens();
}

function hideStartScreen() {
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.add('hidden');
}

function showPauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');
    pauseScreen.classList.remove('hidden');
}

function hidePauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');
    pauseScreen.classList.add('hidden');
}

function showGameOverScreen() {
    disablePauseButton();
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.remove('hidden');
}

function showWinScreen() {
    disablePauseButton();
    const winScreen = document.getElementById('winScreen');
    winScreen.classList.remove('hidden');
}

function hideEndScreens() {
    hideGameOverScreen();
    hideWinScreen();
}

function hideGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.add('hidden');
}

function hideWinScreen() {
    const winScreen = document.getElementById('winScreen');
    winScreen.classList.add('hidden');
}

function enablePauseButton() {
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.disabled = false;
}

function disablePauseButton() {
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.disabled = true;
}