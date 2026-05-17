'use strict';

let sharkyGame;

window.addEventListener('load', initializeApplication);

function initializeApplication() {
    const keyboard = new Keyboard();
    const canvas = document.getElementById('gameCanvas');

    sharkyGame = new Game(canvas, keyboard);
    bindMenuButtons();
}

function bindMenuButtons() {
    bindLevelButtons();
    bindPauseButton();
    bindResumeButton();
    bindRestartButton();
    bindMainMenuButton();
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

function bindRestartButton() {
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', restartGame);
}

function bindMainMenuButton() {
    const mainMenuButton = document.getElementById('mainMenuButton');
    mainMenuButton.addEventListener('click', returnToMainMenu);
}

function startSelectedLevel(event) {
    const levelNumber = Number(event.currentTarget.dataset.level);
    sharkyGame.start(levelNumber);
    updateGameHud();
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
    updateGameHud();
    hidePauseScreen();
}

function returnToMainMenu() {
    sharkyGame.stop();
    disablePauseButton();
    showStartScreen();
}

function showGameScreen() {
    hideStartScreen();
    hidePauseScreen();
    enablePauseButton();
}

function showStartScreen() {
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.remove('hidden');
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

function enablePauseButton() {
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.disabled = false;
}

function disablePauseButton() {
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.disabled = true;
}

function updateGameHud() {
    updateLevelDisplay();
    updateCoinDisplay();
}

function updateLevelDisplay() {
    const levelDisplay = document.getElementById('levelDisplay');
    levelDisplay.textContent = `Level: ${sharkyGame.gameState.currentLevel}`;
}

function updateCoinDisplay() {
    const coinDisplay = document.getElementById('coinDisplay');
    coinDisplay.textContent = `Münzen: ${sharkyGame.gameState.coins}`;
}