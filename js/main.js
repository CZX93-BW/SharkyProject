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
    bindShopButtons();
}

function bindLevelButtons() {
    const levelButtons = document.querySelectorAll('[data-level]');
    levelButtons.forEach((button) => button.addEventListener('click', startSelectedLevel));
}

function bindPauseButton() {
    bindButton('pauseButton', pauseGame);
}

function bindResumeButton() {
    bindButton('resumeButton', resumeGame);
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
    bindButton('shopMainMenuButton', returnToMainMenu);
}

function bindShopButtons() {
    bindButton('continueLevelTwoButton', continueToLevelTwo);
    bindUpgradeButtons();
}

function bindUpgradeButtons() {
    const upgradeButtons = document.querySelectorAll('[data-upgrade]');
    upgradeButtons.forEach((button) => button.addEventListener('click', buySelectedUpgrade));
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

function continueToLevelTwo() {
    sharkyGame.startNextLevel(2);
    showGameScreen();
}

function buySelectedUpgrade(event) {
    const upgradeName = event.currentTarget.dataset.upgrade;
    sharkyGame.purchaseUpgrade(upgradeName);
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
    updateShopHud(gameState);
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
    healthDisplay.textContent = `Leben: ${gameState.player.health}/${gameState.player.maxHealth}`;
}

function updateCoinDisplay(gameState) {
    const coinDisplay = document.getElementById('coinDisplay');
    coinDisplay.textContent = `Münzen: ${gameState.coins}`;
}

function updatePoisonDisplay(gameState) {
    const poisonDisplay = document.getElementById('poisonDisplay');
    poisonDisplay.textContent = `Gift: ${gameState.poisonBottles}/${gameState.getMaxPoisonBottles()}`;
}

function updateStatusDisplay(gameState) {
    const statusDisplay = document.getElementById('statusDisplay');
    statusDisplay.textContent = `Status: ${getReadableStatus(gameState.status)}`;
}

function updateShopHud(gameState) {
    const shopCoinDisplay = document.getElementById('shopCoinDisplay');
    shopCoinDisplay.textContent = gameState.coins;
    updateUpgradeButtons(gameState);
}

function updateUpgradeButtons(gameState) {
    const upgradeButtons = document.querySelectorAll('[data-upgrade]');
    upgradeButtons.forEach((button) => updateUpgradeButton(button, gameState));
}

function updateUpgradeButton(button, gameState) {
    const upgradeName = button.dataset.upgrade;

    button.disabled = !gameState.canPurchaseUpgrade(upgradeName);
    button.textContent = getUpgradeButtonText(upgradeName, gameState);
}

function getUpgradeButtonText(upgradeName, gameState) {
    if (gameState.isUpgradeOwned(upgradeName)) {
        return 'Gekauft';
    }

    return `Kaufen · ${gameState.getUpgradeCost(upgradeName)} Münzen`;
}

function getReadableStatus(status) {
    const statusTexts = {
        menu: 'Menü',
        playing: 'Läuft',
        paused: 'Pause',
        shop: 'Shop',
        gameOver: 'Verloren',
        levelComplete: 'Geschafft'
    };

    return statusTexts[status] || 'Unbekannt';
}

function updateStatusScreens(gameState) {
    hideStatusScreens();

    if (gameState.status === 'shop') {
        showShopScreen();
    }

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
    hideStatusScreens();
    enablePauseButton();
}

function showStartScreen() {
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.remove('hidden');
    hidePauseScreen();
    hideStatusScreens();
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

function showShopScreen() {
    disablePauseButton();
    const shopScreen = document.getElementById('shopScreen');
    shopScreen.classList.remove('hidden');
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

function hideStatusScreens() {
    hideShopScreen();
    hideGameOverScreen();
    hideWinScreen();
}

function hideShopScreen() {
    const shopScreen = document.getElementById('shopScreen');
    shopScreen.classList.add('hidden');
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