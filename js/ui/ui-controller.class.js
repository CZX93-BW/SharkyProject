'use strict';

/** Coordinates interface events, game screens, HUD values, and audio controls. */
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
        this.wasPlayingBeforeSettings = false;
        this.previousGameStatus = 'menu';
    }

    /** Registers interface events and restores the main-menu state. */
    initialize() {
        this.bindApplicationButtons();
        this.bindInterfaceClickSound();
        this.initializeStoryButtons();
        this.updateAudioControls();
        this.screenManager.showMainMenuScreen();
    }

    /** Plays the interface click sound for active buttons and links. */
    bindInterfaceClickSound() {
        document.addEventListener('pointerdown', (event) => {
            const control = event.target.closest(
                'button:not([data-mobile-action]), a'
            );
            if (!control || control.disabled) {
                return;
            }
            this.audioManager.unlock(false);
            this.audioManager.playSound('buttonClick');
        });
    }

    /** Registers all application button and range-input listeners. */
    bindApplicationButtons() {
        this.bindMainMenuButtons();
        this.bindGameMenuButtons();
        this.bindIngameControlButtons();
        this.bindAudioVolumeControls();
    }

    /** Registers all main-menu listeners. */
    bindMainMenuButtons() {
        this.bindStartLevelButtons();
        this.bindMainPanelButtons();
        this.bindClosePanelButtons();
        this.bindPanelBackdropListeners();
        this.bindStoryButtons();
    }

    /** Registers level-selection button listeners. */
    bindStartLevelButtons() {
        const buttons = document.querySelectorAll('[data-start-level]');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                this.startSelectedLevel(event);
            });
        });
    }

    /** Registers main-menu panel button listeners. */
    bindMainPanelButtons() {
        const buttons = document.querySelectorAll('[data-main-panel]');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                this.openSelectedPanel(event);
            });
        });
    }

    /** Registers main-menu panel close listeners. */
    bindClosePanelButtons() {
        const buttons = document.querySelectorAll('[data-close-panel]');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                this.closeMainMenuPanels();
            });
        });
    }

    /** Registers closing through clicks on panel backdrops. */
    bindPanelBackdropListeners() {
        const panels = document.querySelectorAll('.main-menu-panel');
        panels.forEach((panel) => {
            panel.addEventListener('click', (event) => {
                this.closePanelFromBackdrop(event);
            });
        });
    }

    /** @param {MouseEvent} event - Main-menu panel click event. */
    closePanelFromBackdrop(event) {
        if (event.target === event.currentTarget) {
            this.closeMainMenuPanels();
        }
    }

    /** Registers story narration listeners. */
    bindStoryButtons() {
        this.bindButton('readStoryButton', () => this.readStory());
        this.bindButton('stopStoryButton', () => this.stopStory());
    }

    /** Registers pause, status-screen, and shop listeners. */
    bindGameMenuButtons() {
        this.bindResumeButton();
        this.bindRestartButtons();
        this.bindMainMenuButtonsInsideGame();
        this.bindShopButtons();
    }

    /** Registers the pause-overlay resume listener. */
    bindResumeButton() {
        this.bindButton('resumeButton', () => this.resumeGame());
    }

    /** Registers every available game restart listener. */
    bindRestartButtons() {
        this.bindButton('restartButton', () => this.restartGame());
        this.bindButton(
            'gameOverRestartButton',
            () => this.restartGame()
        );
        this.bindButton('winRestartButton', () => this.restartGame());
    }

    /** Registers all in-game return-to-menu listeners. */
    bindMainMenuButtonsInsideGame() {
        this.bindButton(
            'mainMenuButton',
            () => this.returnToMainMenu()
        );
        this.bindButton(
            'gameOverMainMenuButton',
            () => this.returnToMainMenu()
        );
        this.bindButton(
            'winMainMenuButton',
            () => this.returnToMainMenu()
        );
        this.bindButton(
            'shopMainMenuButton',
            () => this.returnToMainMenu()
        );
        this.bindButton(
            'returnHomeHeaderButton',
            () => this.returnToMainMenu()
        );
    }

    /** Registers shop continuation and upgrade listeners. */
    bindShopButtons() {
        this.bindButton(
            'continueLevelTwoButton',
            () => this.continueToLevelTwo()
        );
        this.bindUpgradeButtons();
    }

    /** Registers every shop upgrade button listener. */
    bindUpgradeButtons() {
        const buttons = document.querySelectorAll('[data-upgrade]');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                this.buySelectedUpgrade(event);
            });
        });
    }

    /** Registers pause, audio, and settings listeners. */
    bindIngameControlButtons() {
        this.bindButton(
            'pausePlayButton',
            () => this.togglePauseState()
        );
        this.bindCompactAudioButton();
        this.bindButton(
            'openSettingsButton',
            () => this.openIngameSettingsDialog()
        );
        this.bindButton(
            'closeSettingsButton',
            () => this.closeIngameSettingsDialog()
        );
        this.bindAudioToggleButtons();
    }

    /** Registers pointer and keyboard activation for the audio button. */
    bindCompactAudioButton() {
        const button = document.getElementById('musicToggleButton');
        if (!button) {
            return;
        }
        button.addEventListener('pointerdown', (event) => {
            this.handleCompactAudioPointer(event);
        });
        button.addEventListener('click', (event) => {
            this.handleCompactAudioKeyboardClick(event);
        });
    }

    /** @param {PointerEvent} event - Pointer activation event. */
    handleCompactAudioPointer(event) {
        event.preventDefault();
        this.toggleAllAudioSetting();
    }

    /** @param {MouseEvent} event - Native or keyboard-generated click. */
    handleCompactAudioKeyboardClick(event) {
        if (event.detail === 0) {
            this.toggleAllAudioSetting();
        }
    }

    /** Registers all music and sound toggle listeners. */
    bindAudioToggleButtons() {
        this.bindButton(
            'musicSettingButton',
            () => this.toggleMusicSetting()
        );
        this.bindButton(
            'soundSettingButton',
            () => this.toggleSoundSetting()
        );
        this.bindButton(
            'mainMusicSettingButton',
            () => this.toggleMusicSetting()
        );
        this.bindButton(
            'mainSoundSettingButton',
            () => this.toggleSoundSetting()
        );
    }

    /** Registers in-game and main-menu audio volume controls. */
    bindAudioVolumeControls() {
        this.bindMusicVolumeControls();
        this.bindSoundVolumeControls();
    }

    /** Registers both music volume range inputs. */
    bindMusicVolumeControls() {
        this.bindRangeInput('musicVolumeSlider', (event) => {
            this.handleMusicVolumeChange(event);
        });
        this.bindRangeInput('mainMusicVolumeSlider', (event) => {
            this.handleMusicVolumeChange(event);
        });
    }

    /** Registers both sound volume range inputs. */
    bindSoundVolumeControls() {
        this.bindRangeInput('soundVolumeSlider', (event) => {
            this.handleSoundVolumeChange(event);
        });
        this.bindRangeInput('mainSoundVolumeSlider', (event) => {
            this.handleSoundVolumeChange(event);
        });
    }

    /**
     * @param {string} buttonId - Button element identifier.
     * @param {Function} callback - Click callback to register.
     */
    bindButton(buttonId, callback) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', callback);
        }
    }

    /**
     * @param {string} inputId - Range input element identifier.
     * @param {Function} callback - Input callback to register.
     */
    bindRangeInput(inputId, callback) {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', callback);
        }
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

    /** @param {HTMLButtonElement} readButton - Story narration button. */
    disableStoryReadButton(readButton) {
        readButton.textContent = 'Vorlesen nicht verfügbar';
        readButton.disabled = true;
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
        this.openMainMenuPanel(panelId);
    }

    /** @param {string} panelId - Main-menu panel identifier. */
    openMainMenuPanel(panelId) {
        this.stopStory();
        this.screenManager.openMainMenuPanel(panelId);
    }

    /** Stops narration and closes every main-menu panel. */
    closeMainMenuPanels() {
        this.stopStory();
        this.screenManager.closeMainMenuPanels();
    }

    /** @param {Event} event - Level-selection click event. */
    startSelectedLevel(event) {
        const levelNumber = Number(
            event.currentTarget.dataset.startLevel
        );
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
    }

    /** Resumes gameplay and hides pause-related overlays. */
    resumeGame() {
        this.game.resume();
        this.screenManager.hidePauseScreen();
        this.screenManager.hideIngameSettingsDialog();
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

    /** Opens settings and remembers the previous gameplay state. */
    openIngameSettingsDialog() {
        this.wasPlayingBeforeSettings =
            this.game.gameState.status === 'playing';
        this.pauseGameForSettingsIfNeeded();
        this.screenManager.showIngameSettingsDialog();
    }

    /** Pauses gameplay when settings open during active play. */
    pauseGameForSettingsIfNeeded() {
        if (this.wasPlayingBeforeSettings) {
            this.game.pause();
        }
    }

    /** Closes settings and restores the previous gameplay state. */
    closeIngameSettingsDialog() {
        this.screenManager.hideIngameSettingsDialog();
        this.resumeGameAfterSettingsIfNeeded();
        this.wasPlayingBeforeSettings = false;
    }

    /** Resumes gameplay when settings caused the pause. */
    resumeGameAfterSettingsIfNeeded() {
        if (this.wasPlayingBeforeSettings) {
            this.game.resume();
        }
    }

    /** Toggles music and synchronizes its controls. */
    toggleMusicSetting() {
        this.unlockAudio();
        this.audioManager.toggleMusic();
        this.updateIngameControlButtons(this.game.gameState);
    }

    /** Toggles sound effects and synchronizes audio controls. */
    toggleSoundSetting() {
        this.audioManager.toggleSound();
        this.updateAudioControls();
    }

    /** Toggles music and effects through the compact audio control. */
    toggleAllAudioSetting() {
        const shouldEnable = !this.areAllAudioChannelsEnabled();
        this.setMusicEnabledIfNeeded(shouldEnable);
        this.setSoundEnabledIfNeeded(shouldEnable);
        this.updateAudioControls();
    }

    /** @returns {boolean} Whether music and sound effects are enabled. */
    areAllAudioChannelsEnabled() {
        return this.audioManager.isMusicEnabled() &&
            this.audioManager.isSoundEnabled();
    }

    /** @param {boolean} isEnabled - Required music state. */
    setMusicEnabledIfNeeded(isEnabled) {
        if (this.audioManager.isMusicEnabled() !== isEnabled) {
            this.audioManager.toggleMusic();
        }
    }

    /** @param {boolean} isEnabled - Required sound-effect state. */
    setSoundEnabledIfNeeded(isEnabled) {
        if (this.audioManager.isSoundEnabled() !== isEnabled) {
            this.audioManager.toggleSound();
        }
    }

    /** @param {Event} event - Music range-input event. */
    handleMusicVolumeChange(event) {
        const volume = Number(event.currentTarget.value);
        this.audioManager.setMusicVolumeByPercent(volume);
        this.updateAudioControls();
    }

    /** @param {Event} event - Sound range-input event. */
    handleSoundVolumeChange(event) {
        const volume = Number(event.currentTarget.value);
        this.audioManager.setSoundVolumeByPercent(volume);
        this.updateAudioControls();
    }

    /** @param {GameState} gameState - Updated game state. */
    handleGameStatusUpdate(gameState) {
        this.updateGameHud(gameState);
        this.updateShopHud(gameState);
        this.updateStatusScreens(gameState);
        this.updateIngameControlButtons(gameState);
        this.playStatusSoundIfNeeded(gameState.status);
    }

    /** @param {string} status - Current game status. */
    playStatusSoundIfNeeded(status) {
        if (status === this.previousGameStatus) {
            return;
        }
        this.previousGameStatus = status;
        this.playStatusSound(status);
    }

    /** @param {string} status - Newly entered game status. */
    playStatusSound(status) {
        if (status === 'gameOver') {
            this.audioManager.playSound('gameOver');
        }
        if (status === 'levelComplete') {
            this.audioManager.playSound('win');
        }
    }

    /** @param {GameState} gameState - Current game state. */
    updateGameHud(gameState) {
        this.updateText(
            'levelDisplay',
            `Level: ${gameState.currentLevel}`
        );
        this.updateHealthDisplay(gameState);
        this.updateText(
            'coinDisplay',
            `Münzen: ${gameState.coins}`
        );
        this.updatePoisonDisplay(gameState);
        this.updateText(
            'statusDisplay',
            `Status: ${this.getReadableStatus(gameState.status)}`
        );
    }

    /** @param {GameState} gameState - Current game state. */
    updateHealthDisplay(gameState) {
        const player = gameState.player;
        const healthText =
            `Leben: ${player.health}/${player.maxHealth}`;
        this.updateText('healthDisplay', healthText);
    }

    /** @param {GameState} gameState - Current game state. */
    updatePoisonDisplay(gameState) {
        const maximum = gameState.getMaxPoisonBottles();
        const poisonText =
            `Gift: ${gameState.poisonBottles}/${maximum}`;
        this.updateText('poisonDisplay', poisonText);
    }

    /** @param {GameState} gameState - Current game state. */
    updateShopHud(gameState) {
        this.updateText('shopCoinDisplay', gameState.coins);
        this.updateUpgradeButtons(gameState);
    }

    /** @param {GameState} gameState - Current game state. */
    updateUpgradeButtons(gameState) {
        const buttons = document.querySelectorAll('[data-upgrade]');
        buttons.forEach((button) => {
            this.updateUpgradeButton(button, gameState);
        });
    }

    /**
     * @param {HTMLButtonElement} button - Shop upgrade button.
     * @param {GameState} gameState - Current game state.
     */
    updateUpgradeButton(button, gameState) {
        const upgradeName = button.dataset.upgrade;
        button.disabled =
            !gameState.canPurchaseUpgrade(upgradeName);
        button.textContent =
            this.getUpgradeButtonText(upgradeName, gameState);
    }

    /**
     * @param {string} upgradeName - Configured upgrade name.
     * @param {GameState} gameState - Current game state.
     * @returns {string} Current label for the upgrade button.
     */
    getUpgradeButtonText(upgradeName, gameState) {
        if (gameState.isUpgradeOwned(upgradeName)) {
            return 'Gekauft';
        }
        return `Kaufen · ${gameState.getUpgradeCost(upgradeName)} Münzen`;
    }

    /**
     * @param {string} status - Internal game status.
     * @returns {string} German user-facing status label.
     */
    getReadableStatus(status) {
        const statusTexts = this.createReadableStatusTexts();
        return statusTexts[status] || 'Unbekannt';
    }

    /** @returns {Object} German labels for every known game status. */
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

    /** @param {GameState} gameState - Current game state. */
    updateStatusScreens(gameState) {
        this.screenManager.hideStatusScreens();
        this.showStatusScreen(gameState.status);
    }

    /** @param {string} status - Current game status. */
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

    /** Disables game controls and shows the shop screen. */
    showShopScreen() {
        this.screenManager.setIngameControlDisabled(true);
        this.screenManager.showShopScreen();
    }

    /** Disables game controls and shows the game-over screen. */
    showGameOverScreen() {
        this.screenManager.setIngameControlDisabled(true);
        this.screenManager.showGameOverScreen();
    }

    /** Disables game controls and shows the win screen. */
    showWinScreen() {
        this.screenManager.setIngameControlDisabled(true);
        this.screenManager.showWinScreen();
    }

    /** @param {GameState} gameState - Current game state. */
    updateIngameControlButtons(gameState) {
        this.updatePausePlayButton(gameState);
        this.updateAudioControls();
    }

    /** @param {GameState} gameState - Current game state. */
    updatePausePlayButton(gameState) {
        const button = document.getElementById('pausePlayButton');
        if (button) {
            this.applyPausePlayButtonState(button, gameState);
        }
    }

    /**
     * @param {HTMLButtonElement} button - Pause/play control.
     * @param {GameState} gameState - Current game state.
     */
    applyPausePlayButtonState(button, gameState) {
        const isPaused = gameState.status === 'paused';
        button.textContent = isPaused ? '▶' : '⏸';
        button.classList.toggle('is-active', isPaused);
        button.disabled = !this.canUsePausePlay(gameState);
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @returns {boolean} Whether pause/play may currently be used.
     */
    canUsePausePlay(gameState) {
        return gameState.status === 'playing' ||
            gameState.status === 'paused';
    }

    /** Synchronizes every music, sound, and volume control. */
    updateAudioControls() {
        this.updateMusicButtons();
        this.updateSoundButtons();
        this.updateAudioSliders();
    }

    /** Synchronizes all music toggle controls. */
    updateMusicButtons() {
        this.updateMusicToggleButton();
        this.updateMusicSettingButton('musicSettingButton');
        this.updateMusicSettingButton('mainMusicSettingButton');
    }

    /** Locates and synchronizes the compact global audio control. */
    updateMusicToggleButton() {
        const button =
            document.getElementById('musicToggleButton');
        if (button) {
            this.applyMusicToggleButtonState(button);
        }
    }

    /** @param {HTMLButtonElement} button - Compact audio control. */
    applyMusicToggleButtonState(button) {
        const isEnabled = this.areAllAudioChannelsEnabled();
        button.textContent = isEnabled ? '🔊' : '🔇';
        button.classList.toggle('is-active', isEnabled);
        button.setAttribute(
            'aria-pressed',
            String(isEnabled)
        );
        button.setAttribute(
            'aria-label',
            isEnabled ? 'Audio ausschalten' : 'Audio einschalten'
        );
    }

    /** @param {string} buttonId - Music setting button identifier. */
    updateMusicSettingButton(buttonId) {
        const statusText =
            this.audioManager.isMusicEnabled() ? 'An' : 'Aus';
        this.updateText(buttonId, `Musik: ${statusText}`);
    }

    /** Synchronizes all sound-effect toggle controls. */
    updateSoundButtons() {
        this.updateSoundSettingButton('soundSettingButton');
        this.updateSoundSettingButton('mainSoundSettingButton');
    }

    /** @param {string} buttonId - Sound button identifier. */
    updateSoundSettingButton(buttonId) {
        const statusText =
            this.audioManager.isSoundEnabled() ? 'An' : 'Aus';
        this.updateText(
            buttonId,
            `Soundeffekte: ${statusText}`
        );
    }

    /** Synchronizes all audio volume range inputs. */
    updateAudioSliders() {
        const musicVolume =
            this.audioManager.getMusicVolumePercent();
        const soundVolume =
            this.audioManager.getSoundVolumePercent();
        this.updateRangeValue(
            'musicVolumeSlider',
            musicVolume
        );
        this.updateRangeValue(
            'mainMusicVolumeSlider',
            musicVolume
        );
        this.updateRangeValue(
            'soundVolumeSlider',
            soundVolume
        );
        this.updateRangeValue(
            'mainSoundVolumeSlider',
            soundVolume
        );
    }

    /**
     * @param {string} inputId - Range input identifier.
     * @param {number} value - Numeric value to display.
     */
    updateRangeValue(inputId, value) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = value;
        }
    }

    /** Closes panels and restores the main-menu screen. */
    showMainMenuScreen() {
        this.closeMainMenuPanels();
        this.screenManager.showMainMenuScreen();
    }

    /** Stops narration and restores active gameplay controls. */
    showGameScreen() {
        this.stopStory();
        this.screenManager.showGameScreen();
        this.screenManager.setIngameControlDisabled(false);
    }

    /**
     * @param {string} elementId - Text element identifier.
     * @param {string|number} text - New visible text content.
     */
    updateText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }
}