'use strict';

let sharkyGame;
let audioManager;
let storyNarrator;
let wasPlayingBeforeSettings = false;
let previousGameStatus = 'menu';

window.addEventListener('load', initializeApplication);

function initializeApplication() {
    const keyboard = new Keyboard();
    const canvas = document.getElementById('gameCanvas');

    audioManager = new AudioManager();
    storyNarrator = new StoryNarrator('storyText');
    new MobileControls(keyboard);
    sharkyGame = new Game(canvas, keyboard, handleGameStatusUpdate, audioManager);
    bindApplicationButtons();
    initializeStoryButtons();
    updateAudioControls();
    showMainMenuScreen();
}

function bindApplicationButtons() {
    bindMainMenuButtons();
    bindGameMenuButtons();
    bindIngameControlButtons();
    bindAudioVolumeControls();
}

function bindMainMenuButtons() {
    bindStartLevelButtons();
    bindMainPanelButtons();
    bindClosePanelButtons();
    bindStoryButtons();
}

function bindStartLevelButtons() {
    const levelButtons = document.querySelectorAll('[data-start-level]');
    levelButtons.forEach((button) => button.addEventListener('click', startSelectedLevel));
}

function bindMainPanelButtons() {
    const panelButtons = document.querySelectorAll('[data-main-panel]');
    panelButtons.forEach((button) => button.addEventListener('click', openSelectedPanel));
}

function bindClosePanelButtons() {
    const closeButtons = document.querySelectorAll('[data-close-panel]');
    closeButtons.forEach((button) => button.addEventListener('click', closeMainMenuPanels));
}

function bindStoryButtons() {
    bindButton('readStoryButton', readStory);
    bindButton('stopStoryButton', stopStory);
}

function bindGameMenuButtons() {
    bindResumeButton();
    bindRestartButtons();
    bindMainMenuButtonsInsideGame();
    bindShopButtons();
}

function bindResumeButton() {
    bindButton('resumeButton', resumeGame);
}

function bindRestartButtons() {
    bindButton('restartButton', restartGame);
    bindButton('gameOverRestartButton', restartGame);
    bindButton('winRestartButton', restartGame);
}

function bindMainMenuButtonsInsideGame() {
    bindButton('mainMenuButton', returnToMainMenu);
    bindButton('gameOverMainMenuButton', returnToMainMenu);
    bindButton('winMainMenuButton', returnToMainMenu);
    bindButton('shopMainMenuButton', returnToMainMenu);
    bindButton('returnHomeHeaderButton', returnToMainMenu);
}

function bindShopButtons() {
    bindButton('continueLevelTwoButton', continueToLevelTwo);
    bindUpgradeButtons();
}

function bindUpgradeButtons() {
    const upgradeButtons = document.querySelectorAll('[data-upgrade]');
    upgradeButtons.forEach((button) => button.addEventListener('click', buySelectedUpgrade));
}

function bindIngameControlButtons() {
    bindButton('pausePlayButton', togglePauseState);
    bindButton('musicToggleButton', toggleMusicSetting);
    bindButton('openSettingsButton', openIngameSettingsDialog);
    bindButton('closeSettingsButton', closeIngameSettingsDialog);
    bindButton('musicSettingButton', toggleMusicSetting);
    bindButton('soundSettingButton', toggleSoundSetting);
    bindButton('mainMusicSettingButton', toggleMusicSetting);
    bindButton('mainSoundSettingButton', toggleSoundSetting);
}

function bindAudioVolumeControls() {
    bindRangeInput('musicVolumeSlider', handleMusicVolumeChange);
    bindRangeInput('mainMusicVolumeSlider', handleMusicVolumeChange);
    bindRangeInput('soundVolumeSlider', handleSoundVolumeChange);
    bindRangeInput('mainSoundVolumeSlider', handleSoundVolumeChange);
}

function bindRangeInput(inputId, callback) {
    const input = document.getElementById(inputId);

    if (input) {
        input.addEventListener('input', callback);
    }
}

function bindButton(buttonId, callback) {
    const button = document.getElementById(buttonId);

    if (button) {
        button.addEventListener('click', callback);
    }
}

function initializeStoryButtons() {
    if (!storyNarrator.isSupported()) {
        disableStoryReading();
    }
}

function disableStoryReading() {
    const readButton = document.getElementById('readStoryButton');

    if (readButton) {
        readButton.textContent = 'Vorlesen nicht verfügbar';
        readButton.disabled = true;
    }
}

function readStory() {
    storyNarrator.read();
}

function stopStory() {
    storyNarrator.stop();
}

function openSelectedPanel(event) {
    const panelId = event.currentTarget.dataset.mainPanel;
    openMainMenuPanel(panelId);
}

function openMainMenuPanel(panelId) {
    closeMainMenuPanels();
    document.getElementById(panelId).classList.remove('hidden');
}

function closeMainMenuPanels() {
    stopStory();
    const panels = document.querySelectorAll('.main-menu-panel');
    panels.forEach((panel) => panel.classList.add('hidden'));
}

function startSelectedLevel(event) {
    const levelNumber = Number(event.currentTarget.dataset.startLevel);
    unlockAudio();
    sharkyGame.start(levelNumber);
    showGameScreen();
}

function continueToLevelTwo() {
    unlockAudio();
    sharkyGame.startNextLevel(2);
    showGameScreen();
}

function buySelectedUpgrade(event) {
    const upgradeName = event.currentTarget.dataset.upgrade;
    sharkyGame.purchaseUpgrade(upgradeName);
}

function unlockAudio() {
    audioManager.unlock();
}

function togglePauseState() {
    if (sharkyGame.gameState.status === 'paused') {
        resumeGame();
        return;
    }

    if (sharkyGame.gameState.status === 'playing') {
        pauseGame();
    }
}

function pauseGame() {
    sharkyGame.pause();
    showPauseScreen();
}

function resumeGame() {
    sharkyGame.resume();
    hidePauseScreen();
    hideIngameSettingsDialog();
}

function restartGame() {
    unlockAudio();
    sharkyGame.restart();
    showGameScreen();
}

function returnToMainMenu() {
    sharkyGame.stop();
    disableIngameControlButtons();
    showMainMenuScreen();
}

function openIngameSettingsDialog() {
    wasPlayingBeforeSettings = sharkyGame.gameState.status === 'playing';

    if (wasPlayingBeforeSettings) {
        sharkyGame.pause();
    }

    showIngameSettingsDialog();
}

function closeIngameSettingsDialog() {
    hideIngameSettingsDialog();

    if (wasPlayingBeforeSettings) {
        sharkyGame.resume();
    }

    wasPlayingBeforeSettings = false;
}

function toggleMusicSetting() {
    unlockAudio();
    audioManager.toggleMusic();
    updateIngameControlButtons(sharkyGame.gameState);
}

function toggleSoundSetting() {
    audioManager.toggleSound();
    updateAudioControls();
}

function handleMusicVolumeChange(event) {
    const volume = Number(event.currentTarget.value);
    audioManager.setMusicVolumeByPercent(volume);
    updateAudioControls();
}

function handleSoundVolumeChange(event) {
    const volume = Number(event.currentTarget.value);
    audioManager.setSoundVolumeByPercent(volume);
    updateAudioControls();
}

function handleGameStatusUpdate(gameState) {
    updateGameHud(gameState);
    updateShopHud(gameState);
    updateStatusScreens(gameState);
    updateIngameControlButtons(gameState);
    playStatusSoundIfNeeded(gameState.status);
}

function playStatusSoundIfNeeded(status) {
    if (status === previousGameStatus) {
        return;
    }

    previousGameStatus = status;
    playStatusSound(status);
}

function playStatusSound(status) {
    if (status === 'shop') {
        audioManager.playSound('shop');
    }

    if (status === 'gameOver') {
        audioManager.playSound('gameOver');
    }

    if (status === 'levelComplete') {
        audioManager.playSound('win');
    }
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

    if (shopCoinDisplay) {
        shopCoinDisplay.textContent = gameState.coins;
    }

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

function updateIngameControlButtons(gameState) {
    updatePausePlayButton(gameState);
    updateAudioControls();
}

function updatePausePlayButton(gameState) {
    const button = document.getElementById('pausePlayButton');
    const isPaused = gameState.status === 'paused';

    button.textContent = isPaused ? '▶' : '⏸';
    button.classList.toggle('is-active', isPaused);
    button.disabled = !canUsePausePlay(gameState);
}

function canUsePausePlay(gameState) {
    return gameState.status === 'playing' || gameState.status === 'paused';
}

function updateAudioControls() {
    updateMusicButtons();
    updateSoundButtons();
    updateAudioSliders();
}

function updateMusicButtons() {
    updateMusicToggleButton();
    updateMusicSettingButton('musicSettingButton');
    updateMusicSettingButton('mainMusicSettingButton');
}

function updateMusicToggleButton() {
    const button = document.getElementById('musicToggleButton');
    const isEnabled = audioManager.isMusicEnabled();

    button.textContent = isEnabled ? '♫' : '♪';
    button.classList.toggle('is-active', isEnabled);
    button.setAttribute('aria-pressed', String(isEnabled));
}

function updateMusicSettingButton(buttonId) {
    const button = document.getElementById(buttonId);
    const statusText = audioManager.isMusicEnabled() ? 'An' : 'Aus';

    if (button) {
        button.textContent = `Musik: ${statusText}`;
    }
}

function updateSoundButtons() {
    updateSoundSettingButton('soundSettingButton');
    updateSoundSettingButton('mainSoundSettingButton');
}

function updateSoundSettingButton(buttonId) {
    const button = document.getElementById(buttonId);
    const statusText = audioManager.isSoundEnabled() ? 'An' : 'Aus';

    if (button) {
        button.textContent = `Soundeffekte: ${statusText}`;
    }
}

function updateAudioSliders() {
    updateRangeValue('musicVolumeSlider', audioManager.getMusicVolumePercent());
    updateRangeValue('mainMusicVolumeSlider', audioManager.getMusicVolumePercent());
    updateRangeValue('soundVolumeSlider', audioManager.getSoundVolumePercent());
    updateRangeValue('mainSoundVolumeSlider', audioManager.getSoundVolumePercent());
}

function updateRangeValue(inputId, value) {
    const input = document.getElementById(inputId);

    if (input) {
        input.value = value;
    }
}

function showMainMenuScreen() {
    closeMainMenuPanels();
    hideGameShell();
    showMainMenu();
    hidePauseScreen();
    hideStatusScreens();
    hideIngameSettingsDialog();
}

function showGameScreen() {
    stopStory();
    hideMainMenu();
    showGameShell();
    hidePauseScreen();
    hideStatusScreens();
    hideIngameSettingsDialog();
    enableIngameControlButtons();
}

function showMainMenu() {
    const mainMenuScreen = document.getElementById('mainMenuScreen');
    mainMenuScreen.classList.remove('hidden');
}

function hideMainMenu() {
    const mainMenuScreen = document.getElementById('mainMenuScreen');
    mainMenuScreen.classList.add('hidden');
}

function showGameShell() {
    const gameShell = document.getElementById('gameShell');
    gameShell.classList.remove('hidden');
}

function hideGameShell() {
    const gameShell = document.getElementById('gameShell');
    gameShell.classList.add('hidden');
}

function showPauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');
    pauseScreen.classList.remove('hidden');
}

function hidePauseScreen() {
    const pauseScreen = document.getElementById('pauseScreen');
    pauseScreen.classList.add('hidden');
}

function showIngameSettingsDialog() {
    const dialog = document.getElementById('ingameSettingsDialog');
    dialog.classList.remove('hidden');
}

function hideIngameSettingsDialog() {
    const dialog = document.getElementById('ingameSettingsDialog');
    dialog.classList.add('hidden');
}

function showShopScreen() {
    disableIngameControlButtons();
    const shopScreen = document.getElementById('shopScreen');
    shopScreen.classList.remove('hidden');
}

function showGameOverScreen() {
    disableIngameControlButtons();
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.remove('hidden');
}

function showWinScreen() {
    disableIngameControlButtons();
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

function enableIngameControlButtons() {
    setIngameControlDisabled(false);
}

function disableIngameControlButtons() {
    setIngameControlDisabled(true);
}

function setIngameControlDisabled(isDisabled) {
    setButtonDisabled('pausePlayButton', isDisabled);
    setButtonDisabled('openSettingsButton', isDisabled);
    setButtonDisabled('musicToggleButton', isDisabled);
}

function setButtonDisabled(buttonId, isDisabled) {
    const button = document.getElementById(buttonId);

    if (button) {
        button.disabled = isDisabled;
    }
}