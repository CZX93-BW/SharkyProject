'use strict';

class DebugChecklist {
    constructor(
        game,
        audioManager,
        storyNarrator
    ) {
        this.game = game;
        this.audioManager = audioManager;
        this.storyNarrator = storyNarrator;
    }

    run() {
        if (!this.shouldRun()) {
            return;
        }

        this.printHeadline();

        console.table(
            this.createResults()
        );
    }

    shouldRun() {
        return this.game.gameState.debugMode;
    }

    printHeadline() {
        console.info(
            'Sharky Debug Checklist'
        );
    }

    createResults() {
        return this.createChecks().map(
            (check) => {
                return this.createResult(check);
            }
        );
    }

    createResult(check) {
        return {
            check: check.name,
            status:
                check.test()
                    ? 'OK'
                    : 'Prüfen'
        };
    }

    createChecks() {
        return [
            this.createCanvasCheck(),
            this.createLevelOneCheck(),
            this.createLevelTwoCheck(),
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
            this.createMobileControlCheck(),
            this.createMainMenuCheck(),
            this.createGameShellCheck()
        ];
    }

    createCanvasCheck() {
        return {
            name: 'Canvas vorhanden',
            test: () => {
                return Boolean(
                    document.getElementById(
                        'gameCanvas'
                    )
                );
            }
        };
    }

    createLevelOneCheck() {
        return {
            name: 'Level 1 vorhanden',
            test: () => {
                return typeof LEVELS !==
                    'undefined' &&
                    Boolean(LEVELS[1]);
            }
        };
    }

    createLevelTwoCheck() {
        return {
            name: 'Level 2 vorhanden',
            test: () => {
                return typeof LEVELS !==
                    'undefined' &&
                    Boolean(LEVELS[2]);
            }
        };
    }

    createBackgroundLayerCheck() {
        return {
            name:
                'Hintergrund-Layer vollständig',
            test: () => {
                return this
                    .hasCompleteBackgroundLayers();
            }
        };
    }

    hasCompleteBackgroundLayers() {
        return LEVELS[1]
            .backgroundObjects.length === 5 &&
            LEVELS[2]
                .backgroundObjects.length === 5;
    }

    createBarrierLayerCheck() {
        return {
            name:
                'Barrieren und Hitboxen vorhanden',
            test: () => {
                return this.hasBarrierLayers();
            }
        };
    }

    hasBarrierLayers() {
        return LEVELS[1]
            .barrierObjects.length >= 2 &&
            LEVELS[2]
                .barrierObjects.length >= 2 &&
            LEVELS[1]
                .solidAreas.length >= 3 &&
            LEVELS[2]
                .solidAreas.length >= 3;
    }

    createCollectibleAnimationCheck() {
        return {
            name:
                'Sammelobjekt-Animationen vorhanden',
            test: () => {
                return ASSET_CONFIG
                    .collectibles
                    .coinAnimation
                    .length === 4 &&
                    ASSET_CONFIG
                        .collectibles
                        .poisonBottleAnimation
                        .length === 8;
            }
        };
    }

    createEnemyVariantCheck() {
        return {
            name:
                'Quallenvarianten vorhanden',
            test: () => {
                return Boolean(
                    ASSET_CONFIG.enemies
                        .jellyFishYellow
                ) &&
                    Boolean(
                        ASSET_CONFIG.enemies
                            .jellyFishPink
                    );
            }
        };
    }

    createPufferStateCheck() {
        return {
            name:
                'Puffer-Zustände vorhanden',
            test: () => {
                return ASSET_CONFIG.enemies
                    .pufferFish.transition
                    .length === 5 &&
                    ASSET_CONFIG.enemies
                        .pufferFish
                        .inflatedSwim
                        .length === 5;
            }
        };
    }

    createStatusBarCheck() {
        return {
            name:
                'Statusleisten vollständig',
            test: () => {
                return this
                    .hasCompleteStatusBars();
            }
        };
    }

    hasCompleteStatusBars() {
        const statusBars =
            ASSET_CONFIG.ui.statusBars;

        return Object.values(
            statusBars
        ).every((images) => {
            return images.length === 6;
        });
    }

    createFinishLockCheck() {
        return {
            name:
                'Finish beim Start gesperrt',
            test: () => {
                return !LEVELS[1]
                    .isFinishUnlocked() &&
                    !LEVELS[2]
                        .isFinishUnlocked();
            }
        };
    }

    createPlayerCheck() {
        return {
            name: 'Player vorhanden',
            test: () => {
                return Boolean(
                    this.game.gameState.player
                );
            }
        };
    }

    createAttackConfigCheck() {
        return {
            name:
                'Attack-Werte vorhanden',
            test: () => {
                return this
                    .hasAttackConfigValues();
            }
        };
    }

    hasAttackConfigValues() {
        return GAME_CONFIG
            .finSlapDamage > 0 &&
            GAME_CONFIG
                .poisonShotImpactDamage > 0 &&
            GAME_CONFIG
                .bubbleTrapDuration > 0;
    }

    createAudioCheck() {
        return {
            name:
                'AudioManager vorhanden',
            test: () => {
                return Boolean(
                    this.audioManager
                );
            }
        };
    }

    createStoryCheck() {
        return {
            name:
                'StoryNarrator vorhanden',
            test: () => {
                return Boolean(
                    this.storyNarrator
                );
            }
        };
    }

    createMobileControlCheck() {
        return {
            name:
                'Mobile Controls vorhanden',
            test: () => {
                return Boolean(
                    document.getElementById(
                        'mobileJoystick'
                    )
                );
            }
        };
    }

    createMainMenuCheck() {
        return {
            name:
                'Hauptmenü vorhanden',
            test: () => {
                return Boolean(
                    document.getElementById(
                        'mainMenuScreen'
                    )
                );
            }
        };
    }

    createGameShellCheck() {
        return {
            name:
                'Game Shell vorhanden',
            test: () => {
                return Boolean(
                    document.getElementById(
                        'gameShell'
                    )
                );
            }
        };
    }
}