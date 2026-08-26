'use strict';

/** Evaluates development checks for required game systems. */
class DebugChecklist {
    /**
     * @param {Game} game - Active game controller.
     * @param {AudioManager} audioManager - Game audio controller.
     * @param {StoryNarrator} storyNarrator - Story speech controller.
     */
    constructor(game, audioManager, storyNarrator) {
        this.game = game;
        this.audioManager = audioManager;
        this.storyNarrator = storyNarrator;
    }

    /** @returns {Object[]} Debug results when debug mode is active. */
    run() {
        if (!this.shouldRun()) {
            return [];
        }
        return this.createResults();
    }

    /** @returns {boolean} Whether the checklist should run. */
    shouldRun() {
        return this.game.gameState.debugMode;
    }

    /** @returns {Object[]} Evaluated checklist results. */
    createResults() {
        return this.createChecks().map((check) => this.createResult(check));
    }

    /**
     * @param {Object} check - Named debug check with test callback.
     * @returns {Object} Display-ready result for one check.
     */
    createResult(check) {
        return {
            check: check.name,
            status: check.test() ? 'OK' : 'Prüfen'
        };
    }

    /** @returns {Object[]} Complete ordered collection of debug checks. */
    createChecks() {
        return [
            ...this.createWorldChecks(),
            ...this.createGameplayChecks(),
            ...this.createInterfaceChecks()
        ];
    }

    /** @returns {Object[]} Level, spawning, and world-layer checks. */
    createWorldChecks() {
        return [
            this.createCanvasCheck(),
            this.createLevelOneCheck(),
            this.createLevelTwoCheck(),
            this.createLevelConfigCheck(),
            this.createBossScalingCheck(),
            this.createEnemySpawnerCheck(),
            this.createEnemyMovementCheck(),
            this.createBackgroundLayerCheck(),
            this.createBarrierLayerCheck()
        ];
    }

    /** @returns {Object[]} Collectible, enemy, player, and attack checks. */
    createGameplayChecks() {
        return [
            this.createCollectibleAnimationCheck(),
            this.createEnemyVariantCheck(),
            this.createPufferStateCheck(),
            this.createStatusBarCheck(),
            this.createFinishLockCheck(),
            this.createPlayerCheck(),
            this.createAttackConfigCheck()
        ];
    }

    /** @returns {Object[]} Audio, story, display, and shell checks. */
    createInterfaceChecks() {
        return [
            this.createAudioCheck(),
            this.createStoryCheck(),
            this.createDisplaySettingsCheck(),
            this.createMobileControlCheck(),
            this.createMainMenuCheck(),
            this.createGameShellCheck()
        ];
    }

    /** @returns {Object} Canvas availability check. */
    createCanvasCheck() {
        return {
            name: 'Canvas vorhanden',
            test: () => Boolean(document.getElementById('gameCanvas'))
        };
    }

    /** @returns {Object} Level-one availability check. */
    createLevelOneCheck() {
        return {
            name: 'Level 1 vorhanden',
            test: () => typeof LEVELS !== 'undefined' && Boolean(LEVELS[1])
        };
    }

    /** @returns {Object} Level-two availability check. */
    createLevelTwoCheck() {
        return {
            name: 'Level 2 vorhanden',
            test: () => typeof LEVELS !== 'undefined' && Boolean(LEVELS[2])
        };
    }

    /** @returns {Object} Validated level-configuration check. */
    createLevelConfigCheck() {
        return {
            name: 'Level-Konfiguration gültig',
            test: () => validateLevelConfigs() &&
                LEVELS[1].config === LEVEL_CONFIG[1] &&
                LEVELS[2].config === LEVEL_CONFIG[2]
        };
    }

    /** @returns {Object} Scalable boss-value check. */
    createBossScalingCheck() {
        return {
            name: 'Boss-Skalierung und Aggressivität aktiv',
            test: () => this.hasConfiguredBossScaling()
        };
    }

    /** @returns {boolean} Whether both bosses use expected scaling. */
    hasConfiguredBossScaling() {
        const levelOneBoss = LEVELS[1].endboss;
        const levelTwoBoss = LEVELS[2].endboss;
        return levelOneBoss.width === GAME_CONFIG.endbossWidth * 1.4 &&
            levelTwoBoss.aggression > levelOneBoss.aggression;
    }

    /** @returns {Object} Dynamic enemy-spawner check. */
    createEnemySpawnerCheck() {
        return {
            name: 'Dynamische EnemySpawner vorhanden',
            test: () => this.hasConfiguredEnemySpawners()
        };
    }

    /** @returns {boolean} Whether both spawners use their level limits. */
    hasConfiguredEnemySpawners() {
        return Boolean(LEVELS[1].enemySpawner) &&
            Boolean(LEVELS[2].enemySpawner) &&
            LEVELS[1].enemySpawner.config.maxActiveEnemies === 5 &&
            LEVELS[2].enemySpawner.config.maxActiveEnemies === 7;
    }

    /** @returns {Object} Scalable enemy-movement check. */
    createEnemyMovementCheck() {
        return {
            name: 'Enemy-Bewegungsprofile aktiv',
            test: () => this.hasConfiguredEnemyMovement()
        };
    }

    /** @returns {boolean} Whether enemy types use distinct movement. */
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

    /** @returns {Object} Background-layer completeness check. */
    createBackgroundLayerCheck() {
        return {
            name: 'Hintergrund-Layer vollständig',
            test: () => this.hasCompleteBackgroundLayers()
        };
    }

    /** @returns {boolean} Whether both levels have all background layers. */
    hasCompleteBackgroundLayers() {
        return LEVELS[1].backgroundObjects.length === 5 &&
            LEVELS[2].backgroundObjects.length === 5;
    }

    /** @returns {Object} Barrier and collision-area check. */
    createBarrierLayerCheck() {
        return {
            name: 'Barrieren und Hitboxen vorhanden',
            test: () => this.hasBarrierLayers()
        };
    }

    /** @returns {boolean} Whether both levels contain required barriers. */
    hasBarrierLayers() {
        return LEVELS[1].barrierObjects.length >= 2 &&
            LEVELS[2].barrierObjects.length >= 2 &&
            LEVELS[1].solidAreas.length >= 3 &&
            LEVELS[2].solidAreas.length >= 3;
    }

    /** @returns {Object} Collectible animation asset check. */
    createCollectibleAnimationCheck() {
        return {
            name: 'Sammelobjekt-Animationen vorhanden',
            test: () => ASSET_CONFIG.collectibles.coinAnimation.length === 4 &&
                ASSET_CONFIG.collectibles.poisonBottleAnimation.length === 8
        };
    }

    /** @returns {Object} Jellyfish variant asset check. */
    createEnemyVariantCheck() {
        return {
            name: 'Quallenvarianten vorhanden',
            test: () => Boolean(ASSET_CONFIG.enemies.jellyFishYellow) &&
                Boolean(ASSET_CONFIG.enemies.jellyFishPink)
        };
    }

    /** @returns {Object} Pufferfish state asset check. */
    createPufferStateCheck() {
        return {
            name: 'Puffer-Zustände vorhanden',
            test: () =>
                ASSET_CONFIG.enemies.pufferFish.transition.length === 5 &&
                ASSET_CONFIG.enemies.pufferFish.inflatedSwim.length === 5
        };
    }

    /** @returns {Object} Status-bar asset check. */
    createStatusBarCheck() {
        return {
            name: 'Statusleisten vollständig',
            test: () => this.hasCompleteStatusBars()
        };
    }

    /** @returns {boolean} Whether every status bar has six images. */
    hasCompleteStatusBars() {
        const statusBars = ASSET_CONFIG.ui.statusBars;
        return Object.values(statusBars).every((images) => images.length === 6);
    }

    /** @returns {Object} Initial finish-lock check. */
    createFinishLockCheck() {
        return {
            name: 'Finish beim Start gesperrt',
            test: () => !LEVELS[1].isFinishUnlocked() &&
                !LEVELS[2].isFinishUnlocked()
        };
    }

    /** @returns {Object} Player availability check. */
    createPlayerCheck() {
        return {
            name: 'Player vorhanden',
            test: () => Boolean(this.game.gameState.player)
        };
    }

    /** @returns {Object} Attack configuration check. */
    createAttackConfigCheck() {
        return {
            name: 'Attack-Werte vorhanden',
            test: () => this.hasAttackConfigValues()
        };
    }

    /** @returns {boolean} Whether required attack values are positive. */
    hasAttackConfigValues() {
        return GAME_CONFIG.finSlapDamage > 0 &&
            GAME_CONFIG.poisonShotImpactDamage > 0 &&
            GAME_CONFIG.bubbleTrapDuration > 0;
    }

    /** @returns {Object} Audio controller availability check. */
    createAudioCheck() {
        return {
            name: 'AudioManager vorhanden',
            test: () => Boolean(this.audioManager)
        };
    }

    /** @returns {Object} Story narrator availability check. */
    createStoryCheck() {
        return {
            name: 'StoryNarrator vorhanden',
            test: () => Boolean(this.storyNarrator)
        };
    }

    /** @returns {Object} Theme and fullscreen control check. */
    createDisplaySettingsCheck() {
        return {
            name: 'Theme und Fullscreen angebunden',
            test: () => this.hasDisplaySettings()
        };
    }

    /** @returns {boolean} Whether theme and fullscreen controls exist. */
    hasDisplaySettings() {
        const theme = document.documentElement.dataset.theme;
        return (theme === 'dark' || theme === 'light') &&
            Boolean(
                document.querySelector('[data-display-action="theme"]')
            ) &&
            Boolean(
                document.querySelector('[data-display-action="fullscreen"]')
            );
    }

    /** @returns {Object} Mobile-control availability check. */
    createMobileControlCheck() {
        return {
            name: 'Mobile Controls vorhanden',
            test: () => Boolean(document.getElementById('mobileJoystick'))
        };
    }

    /** @returns {Object} Main-menu availability check. */
    createMainMenuCheck() {
        return {
            name: 'Hauptmenü vorhanden',
            test: () => Boolean(document.getElementById('mainMenuScreen'))
        };
    }

    /** @returns {Object} Game-shell availability check. */
    createGameShellCheck() {
        return {
            name: 'Game Shell vorhanden',
            test: () => Boolean(document.getElementById('gameShell'))
        };
    }
}