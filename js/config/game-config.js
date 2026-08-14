'use strict';

const GAME_CONFIG = {
    canvasWidth: 960,
    canvasHeight: 540,

    levelOneWidth: 2400,
    levelTwoWidth: 2800,
    levelHeight: 720,

    playerStartX: 120,
    playerStartY: 250,
    playerWidth: 78,
    playerHeight: 48,
    playerSpeed: 4,
    playerHealth: 100,
    playerDamageFromEnemy: 20,
    playerInvulnerabilityDuration: 900,
    playerMaxPoisonBottles: 5,

    upgradeSpeedBonus: 1,
    upgradeHealthBonus: 25,
    upgradePoisonCapacityBonus: 2,

    shopUpgrades: {
        speedBoost: {
            cost: 2
        },
        extraHealth: {
            cost: 3
        },
        poisonCapacity: {
            cost: 2
        }
    },

    diagonalMovementFactor: 0.7071,
    cameraHorizontalFocus: 0.38,
    cameraVerticalFocus: 0.5,

    mobileJoystickThreshold: 0.22,
    mobileJoystickMaxDistance: 42,

    musicVolume: 0.35,
    soundVolume: 0.65,

    enemyWidth: 58,
    enemyHeight: 58,
    enemyHealth: 45,
    enemySpeed: 1.4,
    enemyPatrolRange: 120,
    enemyHurtDuration: 180,
    enemyFallbackColor: '#ff6fb1',
    enemyEyeColor: '#230013',

    endbossWidth: 150,
    endbossHeight: 120,
    endbossHealth: 140,
    endbossSpeed: 1.1,
    endbossDamage: 35,
    endbossPatrolRange: 170,
    endbossIntroductionDistance: 650,
    endbossFallbackColor: '#b05cff',
    endbossEyeColor: '#190020',

    finishObjectWidth: 86,
    finishObjectHeight: 170,
    finishObjectFallbackColor: '#8fffea',

    coinWidth: 34,
    coinHeight: 34,
    coinValue: 1,
    coinFallbackColor: '#ffd84d',

    poisonBottleWidth: 30,
    poisonBottleHeight: 46,
    poisonBottleValue: 1,
    poisonBottleFallbackColor: '#9dff57',

    finSlapWidth: 82,
    finSlapHeight: 56,
    finSlapDamage: 28,
    finSlapDuration: 150,
    finSlapCooldown: 420,
    finSlapFallbackColor:
        'rgba(255, 255, 255, 0.48)',

    poisonShotWidth: 44,
    poisonShotHeight: 22,
    poisonShotSpeed: 8,
    poisonShotImpactDamage: 10,
    poisonShotTickDamage: 8,
    poisonShotDuration: 3600,
    poisonShotTickInterval: 700,
    poisonShotLifetime: 1500,
    poisonShotCooldown: 650,
    poisonShotFallbackColor: '#9dff57',

    bubbleTrapWidth: 58,
    bubbleTrapHeight: 58,
    bubbleTrapSpeed: 6,
    bubbleTrapDuration: 3200,
    bubbleTrapLifetime: 1600,
    bubbleTrapCooldown: 850,
    bubbleTrapFallbackColor:
        'rgba(169, 236, 255, 0.42)',

    playerFallbackColor: '#29d3ff',
    playerEyeColor: '#021018',

    debugParameter: 'debug',
    debugTextX: 18,
    debugTextY: 28,
    debugTextGap: 22
};