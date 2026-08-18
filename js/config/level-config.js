'use strict';

const LEVEL_CONFIG = {
    1: {
        number: 1,
        world: {
            width: 2400,
            height: 720,
            floorHeight: 120
        },
        finish: {
            rightOffset: 120,
            bottomOffset: 290
        },
        spawner: {
            initialCount: 4,
            maxActiveEnemies: 5,
            totalEnemyBudget: 12,
            spawnInterval: {
                min: 3200,
                max: 5200
            },
            minimumPlayerDistance: 320,
            minimumEnemyDistance: 120,
            viewportOffset: 160,
            despawnBuffer: 180,
            bossZoneBuffer: 520,
            pauseDuringBoss: true
        },
        enemyTypes: {
            pufferFish: {
                weight: 0.55,
                width: 58,
                height: 58,
                health: 45,
                damage: 20,
                speed: 1.4,
                patrolRange: 120,
                movementProfile: 'waveLeft'
            },
            jellyFish: {
                weight: 0.25,
                width: 54,
                height: 78,
                health: 45,
                damage: 20,
                speed: 1.4,
                patrolRange: 120,
                movementProfile: 'verticalDrift'
            },
            jellyFishYellow: {
                weight: 0.1,
                width: 54,
                height: 78,
                health: 45,
                damage: 20,
                speed: 1.4,
                patrolRange: 120,
                movementProfile: 'verticalDrift'
            },
            jellyFishPink: {
                weight: 0.1,
                width: 56,
                height: 80,
                health: 60,
                damage: 26,
                speed: 1.65,
                patrolRange: 135,
                movementProfile: 'verticalDrift'
            }
        },
        boss: {
            rightOffset: 420,
            y: 250,
            axis: 'vertical',
            width: 210,
            height: 168,
            health: 180,
            damage: 35,
            speed: 1.1,
            patrolRange: 170,
            introductionDistance: 650,
            activationDistance: 650,
            chaseDistance: 580,
            attackDistance: 180,
            leashDistance: 720,
            attackCooldown: 2100,
            attackFrameDuration: 90,
            aggression: 0.55
        }
    },
    2: {
        number: 2,
        world: {
            width: 2800,
            height: 720,
            floorHeight: 130
        },
        finish: {
            rightOffset: 120,
            bottomOffset: 300
        },
        spawner: {
            initialCount: 4,
            maxActiveEnemies: 7,
            totalEnemyBudget: 18,
            spawnInterval: {
                min: 2600,
                max: 4400
            },
            minimumPlayerDistance: 300,
            minimumEnemyDistance: 110,
            viewportOffset: 150,
            despawnBuffer: 200,
            bossZoneBuffer: 600,
            pauseDuringBoss: true
        },
        enemyTypes: {
            pufferFish: {
                weight: 0.4,
                width: 62,
                height: 62,
                health: 45,
                damage: 20,
                speed: 1.65,
                patrolRange: 160,
                movementProfile: 'waveLeft'
            },
            jellyFish: {
                weight: 0.2,
                width: 58,
                height: 84,
                health: 45,
                damage: 20,
                speed: 1.65,
                patrolRange: 160,
                movementProfile: 'verticalDrift'
            },
            jellyFishYellow: {
                weight: 0.15,
                width: 58,
                height: 84,
                health: 45,
                damage: 20,
                speed: 1.65,
                patrolRange: 160,
                movementProfile: 'verticalDrift'
            },
            jellyFishPink: {
                weight: 0.25,
                width: 58,
                height: 84,
                health: 70,
                damage: 30,
                speed: 2.1,
                patrolRange: 160,
                movementProfile: 'verticalDrift'
            }
        },
        boss: {
            rightOffset: 500,
            y: 230,
            axis: 'vertical',
            width: 210,
            height: 168,
            health: 240,
            damage: 45,
            speed: 1.45,
            patrolRange: 240,
            introductionDistance: 720,
            activationDistance: 740,
            chaseDistance: 680,
            attackDistance: 210,
            leashDistance: 860,
            attackCooldown: 1650,
            attackFrameDuration: 80,
            aggression: 0.78
        }
    }
};

const REQUIRED_LEVEL_NUMBER_PATHS = [
    'number',
    'world.width',
    'world.height',
    'world.floorHeight',
    'finish.rightOffset',
    'finish.bottomOffset',
    'spawner.initialCount',
    'spawner.maxActiveEnemies',
    'spawner.totalEnemyBudget',
    'spawner.spawnInterval.min',
    'spawner.spawnInterval.max',
    'spawner.minimumPlayerDistance',
    'spawner.minimumEnemyDistance',
    'spawner.viewportOffset',
    'spawner.despawnBuffer',
    'spawner.bossZoneBuffer',
    'boss.rightOffset',
    'boss.y',
    'boss.width',
    'boss.height',
    'boss.health',
    'boss.damage',
    'boss.speed',
    'boss.patrolRange',
    'boss.introductionDistance',
    'boss.activationDistance',
    'boss.chaseDistance',
    'boss.attackDistance',
    'boss.leashDistance',
    'boss.attackCooldown',
    'boss.attackFrameDuration',
    'boss.aggression'
];

const REQUIRED_ENEMY_NUMBER_KEYS = [
    'weight',
    'width',
    'height',
    'health',
    'damage',
    'speed',
    'patrolRange'
];

/** Returns one validated level configuration. */
function getLevelConfig(levelNumber) {
    const levelConfig = LEVEL_CONFIG[levelNumber];

    assertLevelConfig(
        Boolean(levelConfig),
        `Level ${levelNumber} is not configured.`
    );

    validateLevelConfig(levelConfig);
    return levelConfig;
}

/** Validates every registered level during application startup. */
function validateLevelConfigs() {
    Object.values(LEVEL_CONFIG).forEach(validateLevelConfig);
    return true;
}

/** Validates the structure and limits of one level. */
function validateLevelConfig(levelConfig) {
    assertLevelConfig(
        Boolean(levelConfig),
        'Level configuration is missing.'
    );

    validateRequiredLevelNumbers(levelConfig);
    validateLevelStrings(levelConfig);
    validateBossRules(levelConfig);
    validateSpawnerLimits(levelConfig);
    validateEnemyTypes(levelConfig);

    return true;
}

/** Ensures all required numeric values are positive. */
function validateRequiredLevelNumbers(levelConfig) {
    REQUIRED_LEVEL_NUMBER_PATHS.forEach((path) => {
        const value = getConfigValue(levelConfig, path);
        const message = `Level ${levelConfig.number}: ${path} must be greater than 0.`;

        assertLevelConfig(
            Number.isFinite(value) && value > 0,
            message
        );
    });
}

/** Validates required string values. */
function validateLevelStrings(levelConfig) {
    const axis = levelConfig.boss.axis;
    const message = `Level ${levelConfig.number}: boss.axis is invalid.`;

    assertLevelConfig(
        axis === 'horizontal' || axis === 'vertical',
        message
    );
}

/** Validates bounded boss behavior values. */
function validateBossRules(levelConfig) {
    const boss = levelConfig.boss;
    const prefix = `Level ${levelConfig.number}:`;

    assertLevelConfig(
        boss.aggression <= 1,
        `${prefix} boss.aggression must not exceed 1.`
    );

    assertLevelConfig(
        boss.attackDistance < boss.chaseDistance,
        `${prefix} boss.attackDistance must be below chaseDistance.`
    );

    assertLevelConfig(
        boss.chaseDistance <= boss.activationDistance,
        `${prefix} boss.chaseDistance exceeds activationDistance.`
    );
}

/** Prevents impossible enemy limits and spawn intervals. */
function validateSpawnerLimits(levelConfig) {
    const spawner = levelConfig.spawner;
    const prefix = `Level ${levelConfig.number}:`;

    assertLevelConfig(
        spawner.initialCount <= spawner.maxActiveEnemies,
        `${prefix} initialCount exceeds maxActiveEnemies.`
    );

    assertLevelConfig(
        spawner.maxActiveEnemies <= spawner.totalEnemyBudget,
        `${prefix} maxActiveEnemies exceeds totalEnemyBudget.`
    );

    assertLevelConfig(
        spawner.spawnInterval.min <= spawner.spawnInterval.max,
        `${prefix} spawn interval minimum exceeds maximum.`
    );
}

/** Validates all configured enemy variants and their weights. */
function validateEnemyTypes(levelConfig) {
    const entries = Object.entries(levelConfig.enemyTypes || {});

    assertLevelConfig(
        entries.length > 0,
        `Level ${levelConfig.number}: no enemy types are configured.`
    );

    entries.forEach(([type, config]) => {
        validateEnemyType(levelConfig, type, config);
    });

    validateEnemyWeightSum(levelConfig, entries);
}

/** Validates one configured enemy variant. */
function validateEnemyType(levelConfig, type, enemyConfig) {
    REQUIRED_ENEMY_NUMBER_KEYS.forEach((key) => {
        const value = enemyConfig[key];
        const message =
            `Level ${levelConfig.number}: ${type}.${key} must be greater than 0.`;

        assertLevelConfig(
            Number.isFinite(value) && value > 0,
            message
        );
    });

    assertLevelConfig(
        typeof enemyConfig.movementProfile === 'string',
        `Level ${levelConfig.number}: ${type}.movementProfile is missing.`
    );
}

/** Ensures weighted random selection can use the configuration directly. */
function validateEnemyWeightSum(levelConfig, entries) {
    const sum = entries.reduce((total, [, config]) => {
        return total + config.weight;
    }, 0);

    const message =
        `Level ${levelConfig.number}: enemy weights must add up to 1.`;

    assertLevelConfig(
        Math.abs(sum - 1) < 0.0001,
        message
    );
}

/** Reads a nested configuration value by its dot-separated path. */
function getConfigValue(config, path) {
    return path
        .split('.')
        .reduce((value, key) => value?.[key], config);
}

/** Throws a readable configuration error when a condition fails. */
function assertLevelConfig(condition, message) {
    if (!condition) {
        throw new Error(`[LEVEL_CONFIG] ${message}`);
    }
}

validateLevelConfigs();