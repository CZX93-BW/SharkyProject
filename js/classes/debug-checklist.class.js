'use strict';

class DebugChecklist {
    constructor(game, audioManager, storyNarrator) {
        this.game = game;
        this.audioManager = audioManager;
        this.storyNarrator = storyNarrator;
    }

    run() {
        if (!this.shouldRun()) {
            return;
        }

        this.printHeadline();
        console.table(this.createResults());
    }

    shouldRun() {
        return this.game.gameState.debugMode;
    }

    printHeadline() {
        console.info('Sharky Debug Checklist');
    }

    createResults() {
        return this.createChecks().map((check) => this.createResult(check));
    }

    createResult(check) {
        return {
            check: check.name,
            status: check.test() ? 'OK' : 'Prüfen'
        };
    }

    createChecks() {
        return [
            this.createCanvasCheck(),
            this.createLevelOneCheck(),
            this.createLevelTwoCheck(),
            this.createPlayerCheck(),
            this.createAttackConfigCheck(),
            this.createAudioCheck(),
            this.createStoryCheck(),
            this.createMobileControlCheck(),
            this.createMainMenuCheck(),
            this.createGameShellCheck()
        ];
    }

    createCanvasCheck() {
        return {
            name: 'Canvas vorhanden',
            test: () => Boolean(document.getElementById('gameCanvas'))
        };
    }

    createLevelOneCheck() {
        return {
            name: 'Level 1 vorhanden',
            test: () => typeof LEVELS !== 'undefined' && Boolean(LEVELS[1])
        };
    }

    createLevelTwoCheck() {
        return {
            name: 'Level 2 vorhanden',
            test: () => typeof LEVELS !== 'undefined' && Boolean(LEVELS[2])
        };
    }

    createPlayerCheck() {
        return {
            name: 'Player vorhanden',
            test: () => Boolean(this.game.gameState.player)
        };
    }

    createAttackConfigCheck() {
        return {
            name: 'Attack-Werte vorhanden',
            test: () => this.hasAttackConfigValues()
        };
    }

    hasAttackConfigValues() {
        return GAME_CONFIG.finSlapDamage > 0 &&
            GAME_CONFIG.poisonShotImpactDamage > 0 &&
            GAME_CONFIG.bubbleTrapDuration > 0;
    }

    createAudioCheck() {
        return {
            name: 'AudioManager vorhanden',
            test: () => Boolean(this.audioManager)
        };
    }

    createStoryCheck() {
        return {
            name: 'StoryNarrator vorhanden',
            test: () => Boolean(this.storyNarrator)
        };
    }

    createMobileControlCheck() {
        return {
            name: 'Mobile Controls vorhanden',
            test: () => Boolean(document.getElementById('mobileJoystick'))
        };
    }

    createMainMenuCheck() {
        return {
            name: 'Hauptmenü vorhanden',
            test: () => Boolean(document.getElementById('mainMenuScreen'))
        };
    }

    createGameShellCheck() {
        return {
            name: 'Game Shell vorhanden',
            test: () => Boolean(document.getElementById('gameShell'))
        };
    }
}