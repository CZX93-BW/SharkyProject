'use strict';

/** Coordinates menu, gameplay, settings, narration, and UI services. */
class UiController {
    /**
     * @param {Game} game - Active game controller.
     * @param {AudioManager} audioManager - Game audio controller.
     * @param {StoryNarrator} storyNarrator - Story speech controller.
     * @param {ScreenManager} screenManager - Interface screen controller.
     */
    constructor(game, audioManager, storyNarrator, screenManager) {
        this.game = game;
        this.audioManager = audioManager;
        this.storyNarrator = storyNarrator;
        this.screenManager = screenManager;
        this.createUiServices();
    }

    /** Creates specialized UI services used by this coordinator. */
    createUiServices() {
        this.audioControls = new UiAudioControls(this.audioManager);
        this.statusController = new UiStatusController(
            this.screenManager, this.audioManager, this.audioControls
        );
        this.eventBinder = new UiEventBinder(this);
    }

    /** Registers interface events and restores the main-menu state. */
    initialize() {
        this.eventBinder.bindApplicationEvents();
        window.addEventListener('resize', () => this.pauseInPortrait());
        this.initializeStoryButtons();
        this.audioControls.updateAudioControls();
        this.screenManager.showMainMenuScreen();
    }

    /** Delegates backdrop listener registration for interface tests. */
    bindPanelBackdropListeners() {
        this.eventBinder.bindPanelBackdropListeners();
    }

    /** Delegates in-game listener registration for interface tests. */
    bindIngameControlButtons() {
        this.eventBinder.bindIngameControlButtons();
        this.audioControls.bindCompactAudioButton();
        this.audioControls.bindAudioToggleButtons();
    }

    /** Disables narration when the browser speech API is unavailable. */
    initializeStoryButtons() {
        if (!this.storyNarrator.isSupported()) {
            this.disableStoryReading();
        }
    }

    /** Locates and disables the story narration button. */
    disableStoryReading() {
        const readButton = document.getElementById('readStoryButton');
        if (readButton) {
            this.disableStoryReadButton(readButton);
        }
    }

    /** @param {HTMLButtonElement} button - Story narration button. */
    disableStoryReadButton(button) {
        button.textContent = 'Vorlesen nicht verfügbar';
        button.disabled = true;
    }

    /** Starts story narration. */
    readStory() {
        this.storyNarrator.read();
    }

    /** Stops active story narration. */
    stopStory() {
        this.storyNarrator.stop();
    }

    /** @param {Event} event - Main-menu panel selection event. */
    openSelectedPanel(event) {
        const panelId = event.currentTarget.dataset.mainPanel;
        this.panelOpener = event.currentTarget;
        this.openMainMenuPanel(panelId);
    }

    /** @param {string} panelId - Main-menu panel identifier. */
    openMainMenuPanel(panelId) {
        this.stopStory();
        this.screenManager.openMainMenuPanel(panelId);
        document.getElementById(panelId).querySelector('[data-close-panel]').focus();
    }

    /** Stops narration and closes every main-menu panel. */
    closeMainMenuPanels() {
        this.stopStory();
        this.screenManager.closeMainMenuPanels();
        this.panelOpener?.focus();
        this.panelOpener = null;
    }

    /** @param {Event} event - Level-selection click event. */
    startSelectedLevel(event) {
        const levelNumber = Number(event.currentTarget.dataset.startLevel);
        this.unlockAudio();
        this.game.start(levelNumber);
        this.showGameScreen();
    }

    /** Starts level two while preserving current session progress. */
    continueToLevelTwo() {
        this.unlockAudio();
        this.game.startNextLevel(2);
        this.showGameScreen();
    }

    /** @param {Event} event - Shop upgrade selection event. */
    buySelectedUpgrade(event) {
        const upgradeName = event.currentTarget.dataset.upgrade;
        this.game.purchaseUpgrade(upgradeName);
        if (event.currentTarget.disabled) {
            document.getElementById('continueLevelTwoButton').focus();
        }
    }

    /** Unlocks browser audio after user interaction. */
    unlockAudio() {
        this.audioManager.unlock();
    }

    /** Toggles between active gameplay and the pause overlay. */
    togglePauseState() {
        if (this.game.gameState.status === 'paused') {
            this.resumeGame();
            return;
        }
        this.pauseGameIfPlaying();
    }

    /** @returns {boolean} Whether the touch orientation notice covers the game. */
    isOrientationNoticeVisible() {
        return document.getElementById('orientationNotice').offsetWidth > 0;
    }

    /** Pauses an active session while the device needs to be rotated. */
    pauseInPortrait() {
        if (this.isOrientationNoticeVisible()) this.pauseGameIfPlaying();
    }

    /** Pauses only while the game is actively playing. */
    pauseGameIfPlaying() {
        if (this.game.gameState.status === 'playing') {
            this.pauseGame();
        }
    }

    /** Pauses the game and shows the pause overlay. */
    pauseGame() {
        this.game.pause();
        this.screenManager.showPauseScreen();
        document.getElementById('resumeButton')?.focus();
    }

    /** Resumes gameplay and hides pause-related overlays. */
    resumeGame() {
        if (this.isOrientationNoticeVisible()) return;
        this.game.resume();
        this.screenManager.hidePauseScreen();
        this.screenManager.hideIngameSettingsDialog();
        document.getElementById('gameCanvas').focus();
    }

    /** Restarts the current level and restores the game screen. */
    restartGame() {
        this.unlockAudio();
        this.game.restart();
        this.showGameScreen();
    }

    /** Stops the session and restores the main-menu screen. */
    returnToMainMenu() {
        this.game.stop();
        this.screenManager.setIngameControlDisabled(true);
        this.showMainMenuScreen();
    }

    /** Opens settings from the pause menu and focuses its close button. */
    openIngameSettingsDialog() {
        this.screenManager.hidePauseScreen();
        this.screenManager.showIngameSettingsDialog();
        document.getElementById('closeSettingsButton')?.focus();
    }

    /** Returns to the pause menu with gameplay still paused. */
    closeIngameSettingsDialog() {
        this.screenManager.hideIngameSettingsDialog();
        this.screenManager.showPauseScreen();
        document.getElementById('openSettingsButton')?.focus();
    }

    /** @param {GameState} gameState - Updated game state. */
    handleGameStatusUpdate(gameState) {
        this.statusController.handleGameStatusUpdate(gameState);
    }

    /** Delegates the combined music and sound toggle. */
    toggleAllAudioSetting() {
        this.audioControls.toggleAllAudioSetting();
    }

    /** Closes panels and restores the main-menu screen. */
    showMainMenuScreen() {
        this.closeMainMenuPanels();
        this.screenManager.showMainMenuScreen();
        document.querySelector('.menu-launch [data-start-level]').focus();
    }

    /** Stops narration and restores active gameplay controls. */
    showGameScreen() {
        this.stopStory();
        this.screenManager.showGameScreen();
        this.screenManager.setIngameControlDisabled(false);
        this.panelOpener = null;
        document.getElementById('gameCanvas').focus();
        this.pauseInPortrait();
    }
}