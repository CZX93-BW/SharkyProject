'use strict';

class ScreenManager {
    showMainMenuScreen() {
        this.closeMainMenuPanels();
        this.hideGameShell();
        this.showMainMenu();
        this.hidePauseScreen();
        this.hideStatusScreens();
        this.hideIngameSettingsDialog();
    }

    showGameScreen() {
        this.hideMainMenu();
        this.showGameShell();
        this.hidePauseScreen();
        this.hideStatusScreens();
        this.hideIngameSettingsDialog();
    }

    openMainMenuPanel(panelId) {
        this.closeMainMenuPanels();
        this.showElement(panelId);
    }

    closeMainMenuPanels() {
        const panels = document.querySelectorAll('.main-menu-panel');
        panels.forEach((panel) => panel.classList.add('hidden'));
    }

    showMainMenu() {
        this.showElement('mainMenuScreen');
    }

    hideMainMenu() {
        this.hideElement('mainMenuScreen');
    }

    showGameShell() {
        this.showElement('gameShell');
    }

    hideGameShell() {
        this.hideElement('gameShell');
    }

    showPauseScreen() {
        this.showElement('pauseScreen');
    }

    hidePauseScreen() {
        this.hideElement('pauseScreen');
    }

    showIngameSettingsDialog() {
        this.showElement('ingameSettingsDialog');
    }

    hideIngameSettingsDialog() {
        this.hideElement('ingameSettingsDialog');
    }

    showShopScreen() {
        this.showElement('shopScreen');
    }

    showGameOverScreen() {
        this.showElement('gameOverScreen');
    }

    showWinScreen() {
        this.showElement('winScreen');
    }

    hideStatusScreens() {
        this.hideElement('shopScreen');
        this.hideElement('gameOverScreen');
        this.hideElement('winScreen');
    }

    setIngameControlDisabled(isDisabled) {
        this.setButtonDisabled('pausePlayButton', isDisabled);
        this.setButtonDisabled('openSettingsButton', isDisabled);
        this.setButtonDisabled('musicToggleButton', isDisabled);
    }

    showElement(elementId) {
        const element = document.getElementById(elementId);

        if (element) {
            element.classList.remove('hidden');
        }
    }

    hideElement(elementId) {
        const element = document.getElementById(elementId);

        if (element) {
            element.classList.add('hidden');
        }
    }

    setButtonDisabled(buttonId, isDisabled) {
        const button = document.getElementById(buttonId);

        if (button) {
            button.disabled = isDisabled;
        }
    }
}