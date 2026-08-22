'use strict';

class UiController {
    constructor(game, audioManager, storyNarrator, screenManager) {
        this.game = game;
        this.audioManager = audioManager;
        this.storyNarrator = storyNarrator;
        this.screenManager = screenManager;
        this.wasPlayingBeforeSettings = false;
        this.previousGameStatus = 'menu';
    }

    initialize() {
        this.bindApplicationButtons();
        this.initializeStoryButtons();
        this.updateAudioControls();
        this.screenManager.showMainMenuScreen();
    }

    bindApplicationButtons() {
        this.bindMainMenuButtons();
        this.bindGameMenuButtons();
        this.bindIngameControlButtons();
        this.bindAudioVolumeControls();
    }

    bindMainMenuButtons() {
        this.bindStartLevelButtons();
        this.bindMainPanelButtons();
        this.bindClosePanelButtons();
        this.bindStoryButtons();
    }

    bindStartLevelButtons() {
        const buttons = document.querySelectorAll('[data-start-level]');
        buttons.forEach((button) => button.addEventListener('click', (event) => this.startSelectedLevel(event)));
    }

    bindMainPanelButtons() {
        const buttons = document.querySelectorAll('[data-main-panel]');
        buttons.forEach((button) => button.addEventListener('click', (event) => this.openSelectedPanel(event)));
    }

    bindClosePanelButtons() {
        const buttons = document.querySelectorAll('[data-close-panel]');
        buttons.forEach((button) => button.addEventListener('click', () => this.closeMainMenuPanels()));
    }

    bindStoryButtons() {
        this.bindButton('readStoryButton', () => this.readStory());
        this.bindButton('stopStoryButton', () => this.stopStory());
    }

    bindGameMenuButtons() {
        this.bindResumeButton();
        this.bindRestartButtons();
        this.bindMainMenuButtonsInsideGame();
        this.bindShopButtons();
    }

    bindResumeButton() {
        this.bindButton('resumeButton', () => this.resumeGame());
    }

    bindRestartButtons() {
        this.bindButton('restartButton', () => this.restartGame());
        this.bindButton('gameOverRestartButton', () => this.restartGame());
        this.bindButton('winRestartButton', () => this.restartGame());
    }

    bindMainMenuButtonsInsideGame() {
        this.bindButton('mainMenuButton', () => this.returnToMainMenu());
        this.bindButton('gameOverMainMenuButton', () => this.returnToMainMenu());
        this.bindButton('winMainMenuButton', () => this.returnToMainMenu());
        this.bindButton('shopMainMenuButton', () => this.returnToMainMenu());
        this.bindButton('returnHomeHeaderButton', () => this.returnToMainMenu());
    }

    bindShopButtons() {
        this.bindButton('continueLevelTwoButton', () => this.continueToLevelTwo());
        this.bindUpgradeButtons();
    }

    bindUpgradeButtons() {
        const buttons = document.querySelectorAll('[data-upgrade]');
        buttons.forEach((button) => button.addEventListener('click', (event) => this.buySelectedUpgrade(event)));
    }

    bindIngameControlButtons() {
        this.bindButton('pausePlayButton', () => this.togglePauseState());
        this.bindButton('musicToggleButton', () => this.toggleMusicSetting());
        this.bindButton('openSettingsButton', () => this.openIngameSettingsDialog());
        this.bindButton('closeSettingsButton', () => this.closeIngameSettingsDialog());
        this.bindAudioToggleButtons();
    }

    bindAudioToggleButtons() {
        this.bindButton('musicSettingButton', () => this.toggleMusicSetting());
        this.bindButton('soundSettingButton', () => this.toggleSoundSetting());
        this.bindButton('mainMusicSettingButton', () => this.toggleMusicSetting());
        this.bindButton('mainSoundSettingButton', () => this.toggleSoundSetting());
    }

    bindAudioVolumeControls() {
        this.bindRangeInput('musicVolumeSlider', (event) => this.handleMusicVolumeChange(event));
        this.bindRangeInput('mainMusicVolumeSlider', (event) => this.handleMusicVolumeChange(event));
        this.bindRangeInput('soundVolumeSlider', (event) => this.handleSoundVolumeChange(event));
        this.bindRangeInput('mainSoundVolumeSlider', (event) => this.handleSoundVolumeChange(event));
    }

    bindButton(buttonId, callback) {
        const button = document.getElementById(buttonId);

        if (button) {
            button.addEventListener('click', callback);
        }
    }

    bindRangeInput(inputId, callback) {
        const input = document.getElementById(inputId);

        if (input) {
            input.addEventListener('input', callback);
        }
    }

    initializeStoryButtons() {
        if (!this.storyNarrator.isSupported()) {
            this.disableStoryReading();
        }
    }

    disableStoryReading() {
        const readButton = document.getElementById('readStoryButton');

        if (readButton) {
            this.disableStoryReadButton(readButton);
        }
    }

    disableStoryReadButton(readButton) {
        readButton.textContent = 'Vorlesen nicht verfügbar';
        readButton.disabled = true;
    }

    readStory() {
        this.storyNarrator.read();
    }

    stopStory() {
        this.storyNarrator.stop();
    }

    openSelectedPanel(event) {
        const panelId = event.currentTarget.dataset.mainPanel;
        this.openMainMenuPanel(panelId);
    }

    openMainMenuPanel(panelId) {
        this.stopStory();
        this.screenManager.openMainMenuPanel(panelId);
    }

    closeMainMenuPanels() {
        this.stopStory();
        this.screenManager.closeMainMenuPanels();
    }

    startSelectedLevel(event) {
        const levelNumber = Number(event.currentTarget.dataset.startLevel);
        this.unlockAudio();
        this.game.start(levelNumber);
        this.showGameScreen();
    }

    continueToLevelTwo() {
        this.unlockAudio();
        this.game.startNextLevel(2);
        this.showGameScreen();
    }

    buySelectedUpgrade(event) {
        const upgradeName = event.currentTarget.dataset.upgrade;
        this.game.purchaseUpgrade(upgradeName);
    }

    unlockAudio() {
        this.audioManager.unlock();
    }

    togglePauseState() {
        if (this.game.gameState.status === 'paused') {
            this.resumeGame();
            return;
        }

        this.pauseGameIfPlaying();
    }

    pauseGameIfPlaying() {
        if (this.game.gameState.status === 'playing') {
            this.pauseGame();
        }
    }

    pauseGame() {
        this.game.pause();
        this.screenManager.showPauseScreen();
    }

    resumeGame() {
        this.game.resume();
        this.screenManager.hidePauseScreen();
        this.screenManager.hideIngameSettingsDialog();
    }

    restartGame() {
        this.unlockAudio();
        this.game.restart();
        this.showGameScreen();
    }

    returnToMainMenu() {
        this.game.stop();
        this.screenManager.setIngameControlDisabled(true);
        this.showMainMenuScreen();
    }

    openIngameSettingsDialog() {
        this.wasPlayingBeforeSettings = this.game.gameState.status === 'playing';
        this.pauseGameForSettingsIfNeeded();
        this.screenManager.showIngameSettingsDialog();
    }

    pauseGameForSettingsIfNeeded() {
        if (this.wasPlayingBeforeSettings) {
            this.game.pause();
        }
    }

    closeIngameSettingsDialog() {
        this.screenManager.hideIngameSettingsDialog();
        this.resumeGameAfterSettingsIfNeeded();
        this.wasPlayingBeforeSettings = false;
    }

    resumeGameAfterSettingsIfNeeded() {
        if (this.wasPlayingBeforeSettings) {
            this.game.resume();
        }
    }

    toggleMusicSetting() {
        this.unlockAudio();
        this.audioManager.toggleMusic();
        this.updateIngameControlButtons(this.game.gameState);
    }

    toggleSoundSetting() {
        this.audioManager.toggleSound();
        this.updateAudioControls();
    }

    handleMusicVolumeChange(event) {
        const volume = Number(event.currentTarget.value);
        this.audioManager.setMusicVolumeByPercent(volume);
        this.updateAudioControls();
    }

    handleSoundVolumeChange(event) {
        const volume = Number(event.currentTarget.value);
        this.audioManager.setSoundVolumeByPercent(volume);
        this.updateAudioControls();
    }

    handleGameStatusUpdate(gameState) {
        this.updateGameHud(gameState);
        this.updateShopHud(gameState);
        this.updateStatusScreens(gameState);
        this.updateIngameControlButtons(gameState);
        this.playStatusSoundIfNeeded(gameState.status);
    }

    playStatusSoundIfNeeded(status) {
        if (status === this.previousGameStatus) {
            return;
        }

        this.previousGameStatus = status;
        this.playStatusSound(status);
    }

    playStatusSound(status) {
        if (status === 'shop') {
            this.audioManager.playSound('shop');
        }

        if (status === 'gameOver') {
            this.audioManager.playSound('gameOver');
        }

        if (status === 'levelComplete') {
            this.audioManager.playSound('win');
        }
    }

    updateGameHud(gameState) {
        this.updateText('levelDisplay', `Level: ${gameState.currentLevel}`);
        this.updateHealthDisplay(gameState);
        this.updateText('coinDisplay', `Münzen: ${gameState.coins}`);
        this.updatePoisonDisplay(gameState);
        this.updateText('statusDisplay', `Status: ${this.getReadableStatus(gameState.status)}`);
    }

    updateHealthDisplay(gameState) {
        const healthText = `Leben: ${gameState.player.health}/${gameState.player.maxHealth}`;
        this.updateText('healthDisplay', healthText);
    }

    updatePoisonDisplay(gameState) {
        const poisonText = `Gift: ${gameState.poisonBottles}/${gameState.getMaxPoisonBottles()}`;
        this.updateText('poisonDisplay', poisonText);
    }

    updateShopHud(gameState) {
        this.updateText('shopCoinDisplay', gameState.coins);
        this.updateUpgradeButtons(gameState);
    }

    updateUpgradeButtons(gameState) {
        const buttons = document.querySelectorAll('[data-upgrade]');
        buttons.forEach((button) => this.updateUpgradeButton(button, gameState));
    }

    updateUpgradeButton(button, gameState) {
        const upgradeName = button.dataset.upgrade;

        button.disabled = !gameState.canPurchaseUpgrade(upgradeName);
        button.textContent = this.getUpgradeButtonText(upgradeName, gameState);
    }

    getUpgradeButtonText(upgradeName, gameState) {
        if (gameState.isUpgradeOwned(upgradeName)) {
            return 'Gekauft';
        }

        return `Kaufen · ${gameState.getUpgradeCost(upgradeName)} Münzen`;
    }

    getReadableStatus(status) {
        const statusTexts = this.createReadableStatusTexts();
        return statusTexts[status] || 'Unbekannt';
    }

    createReadableStatusTexts() {
        return {
            menu: 'Menü',
            playing: 'Läuft',
            paused: 'Pause',
            shop: 'Shop',
            gameOver: 'Verloren',
            levelComplete: 'Geschafft'
        };
    }

    updateStatusScreens(gameState) {
        this.screenManager.hideStatusScreens();
        this.showStatusScreen(gameState.status);
    }

    showStatusScreen(status) {
        if (status === 'shop') {
            this.showShopScreen();
        }

        if (status === 'gameOver') {
            this.showGameOverScreen();
        }

        if (status === 'levelComplete') {
            this.showWinScreen();
        }
    }

    showShopScreen() {
        this.screenManager.setIngameControlDisabled(true);
        this.screenManager.showShopScreen();
    }

    showGameOverScreen() {
        this.screenManager.setIngameControlDisabled(true);
        this.screenManager.showGameOverScreen();
    }

    showWinScreen() {
        this.screenManager.setIngameControlDisabled(true);
        this.screenManager.showWinScreen();
    }

    updateIngameControlButtons(gameState) {
        this.updatePausePlayButton(gameState);
        this.updateAudioControls();
    }

    updatePausePlayButton(gameState) {
        const button = document.getElementById('pausePlayButton');

        if (button) {
            this.applyPausePlayButtonState(button, gameState);
        }
    }

    applyPausePlayButtonState(button, gameState) {
        const isPaused = gameState.status === 'paused';

        button.textContent = isPaused ? '▶' : '⏸';
        button.classList.toggle('is-active', isPaused);
        button.disabled = !this.canUsePausePlay(gameState);
    }

    canUsePausePlay(gameState) {
        return gameState.status === 'playing' || gameState.status === 'paused';
    }

    updateAudioControls() {
        this.updateMusicButtons();
        this.updateSoundButtons();
        this.updateAudioSliders();
    }

    updateMusicButtons() {
        this.updateMusicToggleButton();
        this.updateMusicSettingButton('musicSettingButton');
        this.updateMusicSettingButton('mainMusicSettingButton');
    }

    updateMusicToggleButton() {
        const button = document.getElementById('musicToggleButton');

        if (button) {
            this.applyMusicToggleButtonState(button);
        }
    }

    applyMusicToggleButtonState(button) {
        const isEnabled = this.audioManager.isMusicEnabled();

        button.textContent = isEnabled ? '♫' : '♪';
        button.classList.toggle('is-active', isEnabled);
        button.setAttribute('aria-pressed', String(isEnabled));
    }

    updateMusicSettingButton(buttonId) {
        const statusText = this.audioManager.isMusicEnabled() ? 'An' : 'Aus';
        this.updateText(buttonId, `Musik: ${statusText}`);
    }

    updateSoundButtons() {
        this.updateSoundSettingButton('soundSettingButton');
        this.updateSoundSettingButton('mainSoundSettingButton');
    }

    updateSoundSettingButton(buttonId) {
        const statusText = this.audioManager.isSoundEnabled() ? 'An' : 'Aus';
        this.updateText(buttonId, `Soundeffekte: ${statusText}`);
    }

    updateAudioSliders() {
        this.updateRangeValue('musicVolumeSlider', this.audioManager.getMusicVolumePercent());
        this.updateRangeValue('mainMusicVolumeSlider', this.audioManager.getMusicVolumePercent());
        this.updateRangeValue('soundVolumeSlider', this.audioManager.getSoundVolumePercent());
        this.updateRangeValue('mainSoundVolumeSlider', this.audioManager.getSoundVolumePercent());
    }

    updateRangeValue(inputId, value) {
        const input = document.getElementById(inputId);

        if (input) {
            input.value = value;
        }
    }

    showMainMenuScreen() {
        this.closeMainMenuPanels();
        this.screenManager.showMainMenuScreen();
    }

    showGameScreen() {
        this.stopStory();
        this.screenManager.showGameScreen();
        this.screenManager.setIngameControlDisabled(false);
    }

    updateText(elementId, text) {
        const element = document.getElementById(elementId);

        if (element) {
            element.textContent = text;
        }
    }
}