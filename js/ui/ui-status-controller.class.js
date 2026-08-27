'use strict';

/** Synchronizes game state with HUD, status screens, and control buttons. */
class UiStatusController {
    /**
     * @param {ScreenManager} screenManager - Interface screen controller.
     * @param {AudioManager} audioManager - Game audio controller.
     * @param {UiAudioControls} audioControls - Audio interface controller.
     */
    constructor(screenManager, audioManager, audioControls) {
        this.screenManager = screenManager;
        this.audioManager = audioManager;
        this.audioControls = audioControls;
        this.previousGameStatus = 'menu';
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
        this.updateText('levelDisplay', `Level: ${gameState.currentLevel}`);
        this.updateHealthDisplay(gameState);
        this.updateText('coinDisplay', `Münzen: ${gameState.coins}`);
        this.updatePoisonDisplay(gameState);
        this.updateStatusDisplay(gameState.status);
    }

    /** @param {GameState} gameState - Current game state. */
    updateHealthDisplay(gameState) {
        const player = gameState.player;
        const healthText = `Leben: ${player.health}/${player.maxHealth}`;
        this.updateText('healthDisplay', healthText);
    }

    /** @param {GameState} gameState - Current game state. */
    updatePoisonDisplay(gameState) {
        const maximum = gameState.getMaxPoisonBottles();
        const poisonText = `Gift: ${gameState.poisonBottles}/${maximum}`;
        this.updateText('poisonDisplay', poisonText);
    }

    /** @param {string} status - Internal game status. */
    updateStatusDisplay(status) {
        const readableStatus = this.getReadableStatus(status);
        this.updateText('statusDisplay', `Status: ${readableStatus}`);
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
        button.disabled = !gameState.canPurchaseUpgrade(upgradeName);
        button.textContent = this.getUpgradeButtonText(
            upgradeName, gameState
        );
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
        const cost = gameState.getUpgradeCost(upgradeName);
        return `Kaufen · ${cost} Münzen`;
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
        const screenActions = this.createStatusScreenActions();
        screenActions[status]?.();
    }

    /** @returns {Object} Screen actions keyed by game status. */
    createStatusScreenActions() {
        return {
            shop: () => this.showShopScreen(),
            gameOver: () => this.showGameOverScreen(),
            levelComplete: () => this.showWinScreen()
        };
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
        this.audioControls.updateAudioControls();
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