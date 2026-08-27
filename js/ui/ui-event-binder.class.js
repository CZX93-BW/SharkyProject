'use strict';

/** Registers interface events and delegates actions to the UI controller. */
class UiEventBinder {
    /** @param {UiController} controller - Central interface controller. */
    constructor(controller) {
        this.controller = controller;
    }

    /** Registers every interface event listener. */
    bindApplicationEvents() {
        this.bindMainMenuButtons();
        this.bindGameMenuButtons();
        this.bindIngameControlButtons();
        this.controller.audioControls.bindControls();
        this.bindInterfaceClickSound();
    }

    /** Plays the interface click sound for active buttons and links. */
    bindInterfaceClickSound() {
        document.addEventListener('pointerdown', (event) => {
            this.playInterfaceClickSound(event);
        });
    }

    /** @param {PointerEvent} event - Interface pointer event. */
    playInterfaceClickSound(event) {
        const control = event.target.closest(
            'button:not([data-mobile-action]), a'
        );
        if (!control || control.disabled) {
            return;
        }
        this.controller.audioManager.unlock(false);
        this.controller.audioManager.playSound('buttonClick');
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
                this.controller.startSelectedLevel(event);
            });
        });
    }

    /** Registers main-menu panel button listeners. */
    bindMainPanelButtons() {
        const buttons = document.querySelectorAll('[data-main-panel]');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                this.controller.openSelectedPanel(event);
            });
        });
    }

    /** Registers main-menu panel close listeners. */
    bindClosePanelButtons() {
        const buttons = document.querySelectorAll('[data-close-panel]');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                this.controller.closeMainMenuPanels();
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
            this.controller.closeMainMenuPanels();
        }
    }

    /** Registers story narration listeners. */
    bindStoryButtons() {
        this.bindButton('readStoryButton', () => {
            this.controller.readStory();
        });
        this.bindButton('stopStoryButton', () => {
            this.controller.stopStory();
        });
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
        this.bindButton('resumeButton', () => {
            this.controller.resumeGame();
        });
    }

    /** Registers every available game restart listener. */
    bindRestartButtons() {
        ['restartButton', 'gameOverRestartButton', 'winRestartButton']
            .forEach((buttonId) => {
                this.bindButton(buttonId, () => {
                    this.controller.restartGame();
                });
            });
    }

    /** Registers all in-game return-to-menu listeners. */
    bindMainMenuButtonsInsideGame() {
        this.getMainMenuButtonIds().forEach((buttonId) => {
            this.bindButton(buttonId, () => {
                this.controller.returnToMainMenu();
            });
        });
    }

    /** @returns {string[]} In-game main-menu button identifiers. */
    getMainMenuButtonIds() {
        return [
            'mainMenuButton',
            'gameOverMainMenuButton',
            'winMainMenuButton',
            'shopMainMenuButton',
            'returnHomeHeaderButton'
        ];
    }

    /** Registers shop continuation and upgrade listeners. */
    bindShopButtons() {
        this.bindButton('continueLevelTwoButton', () => {
            this.controller.continueToLevelTwo();
        });
        this.bindUpgradeButtons();
    }

    /** Registers every shop upgrade button listener. */
    bindUpgradeButtons() {
        const buttons = document.querySelectorAll('[data-upgrade]');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                this.controller.buySelectedUpgrade(event);
            });
        });
    }

    /** Registers pause and settings listeners. */
    bindIngameControlButtons() {
        this.bindButton('pausePlayButton', () => {
            this.controller.togglePauseState();
        });
        this.bindButton('openSettingsButton', () => {
            this.controller.openIngameSettingsDialog();
        });
        this.bindButton('closeSettingsButton', () => {
            this.controller.closeIngameSettingsDialog();
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
}