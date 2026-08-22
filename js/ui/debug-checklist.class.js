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
            this.createLevelConfigCheck(),
            this.createBossScalingCheck(),
            this.createEnemySpawnerCheck(),
            this.createEnemyMovementCheck(),
            this.createBackgroundLayerCheck(),
            this.createBarrierLayerCheck(),
            this.createCollectibleAnimationCheck(),
            this.createEnemyVariantCheck(),
            this.createPufferStateCheck(),
            this.createStatusBarCheck(),
            this.createFinishLockCheck(),
            this.createPlayerCheck(),
            this.createAttackConfigCheck(),
            this.createAudioCheck(),
            this.createStoryCheck(),
            this.createDisplaySettingsCheck(),
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

    createLevelConfigCheck() {
        return {
            name: 'Level-Konfiguration gültig',
            test: () => validateLevelConfigs() &&
                LEVELS[1].config === LEVEL_CONFIG[1] &&
                LEVELS[2].config === LEVEL_CONFIG[2]
        };
    }

    createBossScalingCheck() {
        return {
            name: 'Boss-Skalierung und Aggressivität aktiv',
            test: () => this.hasConfiguredBossScaling()
        };
    }

    hasConfiguredBossScaling() {
        const levelOneBoss = LEVELS[1].endboss;
        const levelTwoBoss = LEVELS[2].endboss;
        return levelOneBoss.width === GAME_CONFIG.endbossWidth * 1.4 &&
            levelTwoBoss.aggression > levelOneBoss.aggression;
    }

    createEnemySpawnerCheck() {
        return {
            name: 'Dynamische EnemySpawner vorhanden',
            test: () => this.hasConfiguredEnemySpawners()
        };
    }

    hasConfiguredEnemySpawners() {
        return Boolean(LEVELS[1].enemySpawner) &&
            Boolean(LEVELS[2].enemySpawner) &&
            LEVELS[1].enemySpawner.config.maxActiveEnemies === 5 &&
            LEVELS[2].enemySpawner.config.maxActiveEnemies === 7;
    }

    createEnemyMovementCheck() {
        return {
            name: 'Enemy-Bewegungsprofile aktiv',
            test: () => this.hasConfiguredEnemyMovement()
        };
    }

    hasConfiguredEnemyMovement() {
        const firstLevel = LEVEL_CONFIG[1].enemyTypes;
        const secondLevel = LEVEL_CONFIG[2].enemyTypes;
        return firstLevel.pufferFish.movement.profile === 'waveLeft' &&
            firstLevel.pufferFish.movement.spriteFacing === 'left' &&
            firstLevel.jellyFish.movement.profile === 'verticalDrift' &&
            firstLevel.jellyFish.movement.horizontalSpeed <
                firstLevel.jellyFish.movement.verticalSpeed &&
            secondLevel.pufferFish.movement.horizontalSpeed >
                firstLevel.pufferFish.movement.horizontalSpeed;
    }

    createBackgroundLayerCheck() {
        return {
            name: 'Hintergrund-Layer vollständig',
            test: () => this.hasCompleteBackgroundLayers()
        };
    }

    hasCompleteBackgroundLayers() {
        return LEVELS[1].backgroundObjects.length === 5 &&
            LEVELS[2].backgroundObjects.length === 5;
    }

    createBarrierLayerCheck() {
        return {
            name: 'Barrieren und Hitboxen vorhanden',
            test: () => this.hasBarrierLayers()
        };
    }

    hasBarrierLayers() {
        return LEVELS[1].barrierObjects.length >= 2 &&
            LEVELS[2].barrierObjects.length >= 2 &&
            LEVELS[1].solidAreas.length >= 3 &&
            LEVELS[2].solidAreas.length >= 3;
    }

    createCollectibleAnimationCheck() {
        return {
            name: 'Sammelobjekt-Animationen vorhanden',
            test: () => ASSET_CONFIG.collectibles.coinAnimation.length === 4 &&
                ASSET_CONFIG.collectibles.poisonBottleAnimation.length === 8
        };
    }

    createEnemyVariantCheck() {
        return {
            name: 'Quallenvarianten vorhanden',
            test: () => Boolean(ASSET_CONFIG.enemies.jellyFishYellow) &&
                Boolean(ASSET_CONFIG.enemies.jellyFishPink)
        };
    }

    createPufferStateCheck() {
        return {
            name: 'Puffer-Zustände vorhanden',
            test: () =>
                ASSET_CONFIG.enemies.pufferFish.transition.length === 5 &&
                ASSET_CONFIG.enemies.pufferFish.inflatedSwim.length === 5
        };
    }

    createStatusBarCheck() {
        return {
            name: 'Statusleisten vollständig',
            test: () => this.hasCompleteStatusBars()
        };
    }

    hasCompleteStatusBars() {
        const statusBars = ASSET_CONFIG.ui.statusBars;
        return Object.values(statusBars).every(
            (images) => images.length === 6
        );
    }

    createFinishLockCheck() {
        return {
            name: 'Finish beim Start gesperrt',
            test: () => !LEVELS[1].isFinishUnlocked() &&
                !LEVELS[2].isFinishUnlocked()
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

    createDisplaySettingsCheck() {
        return {
            name: 'Theme und Fullscreen angebunden',
            test: () => this.hasDisplaySettings()
        };
    }

    hasDisplaySettings() {
        const theme = document.documentElement.dataset.theme;
        return (theme === 'dark' || theme === 'light') &&
            Boolean(document.querySelector(
                '[data-display-action="theme"]'
            )) &&
            Boolean(document.querySelector(
                '[data-display-action="fullscreen"]'
            ));
    }

    createMobileControlCheck() {
        return {
            name: 'Mobile Controls vorhanden',
            test: () => Boolean(
                document.getElementById('mobileJoystick')
            )
        };
    }

    createMainMenuCheck() {
        return {
            name: 'Hauptmenü vorhanden',
            test: () => Boolean(
                document.getElementById('mainMenuScreen')
            )
        };
    }

    createGameShellCheck() {
        return {
            name: 'Game Shell vorhanden',
            test: () => Boolean(
                document.getElementById('gameShell')
            )
        };
    }
}