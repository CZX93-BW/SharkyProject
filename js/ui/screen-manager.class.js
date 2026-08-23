'use strict';

/** Applies visibility and disabled states to all major interface screens. */
class ScreenManager {
    /** Restores the complete main-menu screen state. */
    showMainMenuScreen() {
        this.closeMainMenuPanels();
        this.hideGameShell();
        this.showMainMenu();
        this.hidePauseScreen();
        this.hideStatusScreens();
        this.hideIngameSettingsDialog();
    }

    /** Restores the active gameplay screen state. */
    showGameScreen() {
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
    }

    /** Hides every main-menu content panel. */
    closeMainMenuPanels() {
        const panels = document.querySelectorAll('.main-menu-panel');
        panels.forEach((panel) => panel.classList.add('hidden'));
    }

    /** Shows the main-menu container. */
    showMainMenu() {
        this.showElement('mainMenuScreen');
    }

    /** Hides the main-menu container. */
    hideMainMenu() {
        this.hideElement('mainMenuScreen');
    }

    /** Shows the gameplay shell. */
    showGameShell() {
        this.showElement('gameShell');
    }

    /** Hides the gameplay shell. */
    hideGameShell() {
        this.hideElement('gameShell');
    }

    /** Shows the pause overlay. */
    showPauseScreen() {
        this.showElement('pauseScreen');
    }

    /** Hides the pause overlay. */
    hidePauseScreen() {
        this.hideElement('pauseScreen');
    }

    /** Shows the in-game settings dialog. */
    showIngameSettingsDialog() {
        this.showElement('ingameSettingsDialog');
    }

    /** Hides the in-game settings dialog. */
    hideIngameSettingsDialog() {
        this.hideElement('ingameSettingsDialog');
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