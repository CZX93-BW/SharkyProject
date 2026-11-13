

/** Applies visibility and disabled states to all major interface screens. */
class ScreenManager {
    /** Restores the complete main-menu screen state. */
    showMainMenuScreen() {
        this.setGameScreenState(false);
        this.closeMainMenuPanels();
        this.hideGameShell();
        this.showMainMenu();
        this.hidePauseScreen();
        this.hideStatusScreens();
        this.hideIngameSettingsDialog();
    }

    /** Restores the active gameplay screen state. */
    showGameScreen() {
        this.setGameScreenState(true);
        this.closeMainMenuPanels();
        this.hideMainMenu();
        this.showGameShell();
        this.hidePauseScreen();
        this.hideStatusScreens();
        this.hideIngameSettingsDialog();
    }

    /** @param {string} panelId - Main-menu panel element identifier. */
    openMainMenuPanel(panelId) {
        this.closeMainMenuPanels();
        this.showElement(panelId);
        document.querySelector('.main-menu-hero').inert = true;
    }

    /** Hides every main-menu content panel. */
    closeMainMenuPanels() {
        const panels = document.querySelectorAll('.main-menu-panel');
        panels.forEach((panel) => panel.classList.add('hidden'));
        document.querySelector('.main-menu-hero').inert = false;
    }

    /** Shows the main-menu container. */
    showMainMenu() {
        document.getElementById('mainMenuScreen').hidden = false;
    }

    /** Hides the main-menu container. */
    hideMainMenu() {
        document.getElementById('mainMenuScreen').hidden = true;
    }

    /** Shows the gameplay shell. */
    showGameShell() {
        document.getElementById('gameShell').hidden = false;
    }

    /** Hides the gameplay shell. */
    hideGameShell() {
        document.getElementById('gameShell').hidden = true;
    }

    /**
     * @param {boolean} isGameScreen - Whether gameplay currently owns the UI.
     */
    setGameScreenState(isGameScreen) {
        const root = document.documentElement;
        root.classList.toggle('is-game-screen', isGameScreen);
        root.classList.toggle('is-main-menu-screen', !isGameScreen);
    }

    /** Shows the pause overlay. */
    showPauseScreen() {
        this.showElement('pauseScreen');
        this.setGameBackgroundInert(true);
    }

    /** Hides the pause overlay. */
    hidePauseScreen() {
        this.hideElement('pauseScreen');
        this.setGameBackgroundInert(false);
    }

    /** Shows the in-game settings dialog. */
    showIngameSettingsDialog() {
        this.showElement('ingameSettingsDialog');
        this.setGameBackgroundInert(true);
    }

    /** Hides the in-game settings dialog. */
    hideIngameSettingsDialog() {
        this.hideElement('ingameSettingsDialog');
        this.setGameBackgroundInert(false);
    }

    /** @param {boolean} inert - Whether a gameplay dialog owns focus. */
    setGameBackgroundInert(inert) {
        document.querySelectorAll('.game-header, .game-area').forEach((area) => {
            area.inert = inert;
        });
    }

    /** Shows the between-level shop screen. */
    showShopScreen() {
        this.showElement('shopScreen');
    }

    /** Shows the game-over screen. */
    showGameOverScreen() {
        this.showElement('gameOverScreen');
    }

    /** Shows the final win screen. */
    showWinScreen() {
        this.showElement('winScreen');
    }

    /** Hides shop, game-over, and win screens. */
    hideStatusScreens() {
        this.hideElement('shopScreen');
        this.hideElement('gameOverScreen');
        this.hideElement('winScreen');
    }

    /** @param {boolean} isDisabled - Disabled state for game header controls. */
    setIngameControlDisabled(isDisabled) {
        this.setButtonDisabled('pausePlayButton', isDisabled);
        this.setButtonDisabled('openSettingsButton', isDisabled);
        this.setButtonDisabled('musicToggleButton', isDisabled);
    }

    /** @param {string} elementId - Element identifier to show. */
    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    /** @param {string} elementId - Element identifier to hide. */
    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    }

    /**
     * @param {string} buttonId - Button element identifier.
     * @param {boolean} isDisabled - Disabled state to apply.
     */
    setButtonDisabled(buttonId, isDisabled) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = isDisabled;
        }
    }
}
