'use strict';

/**
 * Creates the shared balance values for one enemy type.
 * @param {number} weight - Relative probability used by the spawner.
 * @param {number} width - Enemy width in pixels.
 * @param {number} height - Enemy height in pixels.
 * @param {number} health - Initial enemy health.
 * @param {number} damage - Contact damage dealt to the player.
 * @param {Object} movement - Movement profile configuration.
 * @returns {Object} Complete enemy type configuration.
 */
function createEnemyType(weight, width, height, health, damage, movement) {
    return { weight, width, height, health, damage, movement };
}

/**
 * Creates a horizontal wave movement profile.
 * @param {number} horizontalSpeed - Horizontal movement per frame.
 * @param {number} waveAmplitude - Vertical wave height in pixels.
 * @param {number} waveFrequency - Phase increment per frame.
 * @returns {Object} Configured wave movement profile.
 */
function createWaveMovement(horizontalSpeed, waveAmplitude, waveFrequency) {
    return {
        profile: 'waveLeft', horizontalSpeed,
        waveAmplitude, waveFrequency, spriteFacing: 'left'
    };
}

/**
 * Creates a predominantly vertical movement profile.
 * @param {number} horizontalSpeed - Horizontal drift per frame.
 * @param {number} verticalSpeed - Vertical movement per frame.
 * @param {number} verticalRange - Maximum vertical patrol range.
 * @returns {Object} Configured vertical movement profile.
 */
function createVerticalMovement(horizontalSpeed, verticalSpeed, verticalRange) {
    return {
        profile: 'verticalDrift', horizontalSpeed,
        verticalSpeed, verticalRange, spriteFacing: 'neutral'
    };
}

/**
 * Stores scalable world, enemy, spawner and boss values for every level.
 * @constant
 * @type {Object<number, Object>}
 */
const LEVEL_CONFIG = {
    1: {
        number: 1,
        world: { width: 2400, height: 720, floorHeight: 120 },
        finish: { rightOffset: 120, bottomOffset: 290 },
        spawner: {
            initialCount: 4,
            maxActiveEnemies: 5,
            totalEnemyBudget: 12,
            spawnInterval: { min: 3200, max: 5200 },
            minimumPlayerDistance: 320,
            minimumEnemyDistance: 120,
            viewportOffset: 160,
            despawnBuffer: 180,
            bossZoneBuffer: 520,
            pauseDuringBoss: true
        },
        enemyTypes: {
            pufferFish: createEnemyType(0.55, 58, 58, 45, 20,
                createWaveMovement(1.4, 34, 0.045)),
            jellyFish: createEnemyType(0.25, 54, 78, 45, 20,
                createVerticalMovement(0.16, 1.15, 150)),
            jellyFishYellow: createEnemyType(0.1, 54, 78, 45, 20,
                createVerticalMovement(0.2, 1.35, 170)),
            jellyFishPink: createEnemyType(0.1, 56, 80, 60, 26,
                createVerticalMovement(0.26, 1.65, 190))
        },
        boss: {
            rightOffset: 420, y: 250,
            axis: 'vertical',
            width: 210, height: 168,
            health: 180, damage: 15,
            speed: 1.1, patrolRange: 170,
            introductionDistance: 650, activationDistance: 650,
            chaseDistance: 580, attackDistance: 180,
            leashDistance: 720, attackCooldown: 2100,
            attackFrameDuration: 90,
            aggression: 0.55
        }
    },
    2: {
        number: 2,
        world: { width: 2800, height: 720, floorHeight: 130 },
        finish: { rightOffset: 120, bottomOffset: 300 },
        spawner: {
            initialCount: 4,
            maxActiveEnemies: 7,
            totalEnemyBudget: 18,
            spawnInterval: { min: 2600, max: 4400 },
            minimumPlayerDistance: 300,
            minimumEnemyDistance: 110,
            viewportOffset: 150,
            despawnBuffer: 200,
            bossZoneBuffer: 600,
            pauseDuringBoss: true
        },
        enemyTypes: {
            pufferFish: createEnemyType(0.4, 62, 62, 45, 20,
                createWaveMovement(1.7, 42, 0.052)),
            jellyFish: createEnemyType(0.2, 58, 84, 45, 20,
                createVerticalMovement(0.22, 1.45, 185)),
            jellyFishYellow: createEnemyType(0.15, 58, 84, 45, 20,
                createVerticalMovement(0.27, 1.75, 205)),
            jellyFishPink: createEnemyType(0.25, 58, 84, 70, 30,
                createVerticalMovement(0.34, 2.1, 230))
        },
        boss: {
            rightOffset: 500, y: 230,
            axis: 'vertical',
            width: 210, height: 168,
            health: 240, damage: 30,
            speed: 1.45, patrolRange: 240,
            introductionDistance: 720, activationDistance: 740,
            chaseDistance: 680, attackDistance: 210,
            leashDistance: 860, attackCooldown: 1650,
            attackFrameDuration: 80,
            aggression: 0.78
        }
    }
};

/** @type {string[]} Required positive numeric level paths. */
const REQUIRED_LEVEL_NUMBER_PATHS = [
    'number', 'world.width', 'world.height', 'world.floorHeight',
    'finish.rightOffset', 'finish.bottomOffset', 'spawner.initialCount',
    'spawner.maxActiveEnemies', 'spawner.totalEnemyBudget',
    'spawner.spawnInterval.min', 'spawner.spawnInterval.max',
    'spawner.minimumPlayerDistance', 'spawner.minimumEnemyDistance',
    'spawner.viewportOffset', 'spawner.despawnBuffer',
    'spawner.bossZoneBuffer', 'boss.rightOffset', 'boss.y', 'boss.width',
    'boss.height', 'boss.health', 'boss.damage', 'boss.speed',
    'boss.patrolRange', 'boss.introductionDistance',
    'boss.activationDistance', 'boss.chaseDistance', 'boss.attackDistance',
    'boss.leashDistance', 'boss.attackCooldown', 'boss.attackFrameDuration',
    'boss.aggression'
];
/** @type {string[]} Required positive numeric enemy properties. */
const REQUIRED_ENEMY_NUMBER_KEYS = [
    'weight', 'width', 'height', 'health', 'damage'
];
/** @type {string[]} Supported enemy movement profile names. */
const MOVEMENT_PROFILES = ['waveLeft', 'verticalDrift'];

/**
 * Returns one registered and validated level configuration.
 * @param {number} levelNumber - Number of the requested level.
 * @returns {Object} Validated configuration for the requested level.
 * @throws {Error} If the level is missing or invalid.
 */
function getLevelConfig(levelNumber) {
    const levelConfig = LEVEL_CONFIG[levelNumber];
    const message = `Level ${levelNumber} is not configured.`;
    assertLevelConfig(Boolean(levelConfig), message);
    validateLevelConfig(levelConfig);
    return levelConfig;
}

/**
 * Validates every registered level configuration.
 * @returns {boolean} True after all configurations pass validation.
 * @throws {Error} If any configuration is invalid.
 */
function validateLevelConfigs() {
    Object.values(LEVEL_CONFIG).forEach(validateLevelConfig);
    return true;
}

/**
 * Validates the complete structure and limits of one level.
 * @param {Object} levelConfig - Level configuration to validate.
 * @returns {boolean} True when the configuration is valid.
 * @throws {Error} If a required value is invalid.
 */
function validateLevelConfig(levelConfig) {
    assertLevelConfig(Boolean(levelConfig), 'Level configuration is missing.');
    validateRequiredLevelNumbers(levelConfig);
    validateLevelStrings(levelConfig);
    validateBossRules(levelConfig);
    validateSpawnerLimits(levelConfig);
    validateEnemyTypes(levelConfig);
    return true;
}

/**
 * Validates all required positive numeric level values.
 * @param {Object} levelConfig - Level configuration to validate.
 */
function validateRequiredLevelNumbers(levelConfig) {
    REQUIRED_LEVEL_NUMBER_PATHS.forEach((path) => {
        const value = getConfigValue(levelConfig, path);
        const message =
            `Level ${levelConfig.number}: ${path} must be greater than 0.`;
        assertLevelConfig(Number.isFinite(value) && value > 0, message);
    });
}

/**
 * Validates string-based level settings.
 * @param {Object} levelConfig - Level configuration to validate.
 */
function validateLevelStrings(levelConfig) {
    const axis = levelConfig.boss.axis;
    const message = `Level ${levelConfig.number}: boss.axis is invalid.`;
    assertLevelConfig(axis === 'horizontal' || axis === 'vertical', message);
}

/**
 * Validates bounded boss behavior values.
 * @param {Object} levelConfig - Level configuration to validate.
 */
function validateBossRules(levelConfig) {
    const boss = levelConfig.boss;
    const prefix = `Level ${levelConfig.number}:`;
    assertLevelConfig(boss.aggression <= 1,
        `${prefix} boss.aggression must not exceed 1.`);
    assertLevelConfig(boss.attackDistance < boss.chaseDistance,
        `${prefix} boss.attackDistance must be below chaseDistance.`);
    assertLevelConfig(boss.chaseDistance <= boss.activationDistance,
        `${prefix} boss.chaseDistance exceeds activationDistance.`);
}

/**
 * Validates enemy-count and interval constraints for one spawner.
 * @param {Object} levelConfig - Level configuration to validate.
 */
function validateSpawnerLimits(levelConfig) {
    const prefix = `Level ${levelConfig.number}:`;
    validateSpawnerIntegers(levelConfig.spawner, prefix);
    validateSpawnerRelations(levelConfig, prefix);
}

/**
 * Ensures all spawner counters use integer values.
 * @param {Object} spawner - Spawner configuration to validate.
 * @param {string} prefix - Level-specific error prefix.
 */
function validateSpawnerIntegers(spawner, prefix) {
    assertLevelConfig(Number.isInteger(spawner.initialCount),
        `${prefix} initialCount must be an integer.`);
    assertLevelConfig(Number.isInteger(spawner.maxActiveEnemies),
        `${prefix} maxActiveEnemies must be an integer.`);
    assertLevelConfig(Number.isInteger(spawner.totalEnemyBudget),
        `${prefix} totalEnemyBudget must be an integer.`);
}

/**
 * Validates relationships between spawner and world limits.
 * @param {Object} levelConfig - Level configuration to validate.
 * @param {string} prefix - Level-specific error prefix.
 */
function validateSpawnerRelations(levelConfig, prefix) {
    const spawner = levelConfig.spawner;
    assertLevelConfig(spawner.initialCount <= spawner.maxActiveEnemies,
        `${prefix} initialCount exceeds maxActiveEnemies.`);
    assertLevelConfig(spawner.maxActiveEnemies <= spawner.totalEnemyBudget,
        `${prefix} maxActiveEnemies exceeds totalEnemyBudget.`);
    assertLevelConfig(spawner.spawnInterval.min <= spawner.spawnInterval.max,
        `${prefix} spawn interval minimum exceeds maximum.`);
    assertLevelConfig(spawner.bossZoneBuffer < levelConfig.world.width,
        `${prefix} bossZoneBuffer must be below the world width.`);
    assertLevelConfig(typeof spawner.pauseDuringBoss === 'boolean',
        `${prefix} pauseDuringBoss must be boolean.`);
}

/**
 * Validates all configured enemy variants and their weights.
 * @param {Object} levelConfig - Level configuration to validate.
 */
function validateEnemyTypes(levelConfig) {
    const entries = Object.entries(levelConfig.enemyTypes || {});
    const message =
        `Level ${levelConfig.number}: no enemy types are configured.`;
    assertLevelConfig(entries.length > 0, message);
    entries.forEach(([type, config]) => {
        validateEnemyType(levelConfig, type, config);
    });
    validateEnemyWeightSum(levelConfig, entries);
}

/**
 * Validates one configured enemy variant.
 * @param {Object} levelConfig - Parent level configuration.
 * @param {string} type - Registered enemy type name.
 * @param {Object} enemyConfig - Enemy configuration to validate.
 */
function validateEnemyType(levelConfig, type, enemyConfig) {
    REQUIRED_ENEMY_NUMBER_KEYS.forEach((key) => {
        const value = enemyConfig[key];
        const message =
            `Level ${levelConfig.number}: ${type}.${key} must be greater than 0.`;
        assertLevelConfig(Number.isFinite(value) && value > 0, message);
    });
    validateEnemyMovement(levelConfig, type, enemyConfig.movement);
}

/**
 * Validates shared and profile-specific movement settings.
 * @param {Object} levelConfig - Parent level configuration.
 * @param {string} type - Registered enemy type name.
 * @param {Object} movement - Movement configuration to validate.
 */
function validateEnemyMovement(levelConfig, type, movement) {
    const prefix = `Level ${levelConfig.number}: ${type}.movement`;
    assertLevelConfig(Boolean(movement), `${prefix} is missing.`);
    assertLevelConfig(MOVEMENT_PROFILES.includes(movement.profile),
        `${prefix}.profile is invalid.`);
    validatePositiveMovementValue(movement.horizontalSpeed,
        `${prefix}.horizontalSpeed`);
    validateSpriteFacing(movement.spriteFacing, prefix);
    validateMovementProfileValues(movement, prefix);
}

/**
 * Validates numeric values required by a movement profile.
 * @param {Object} movement - Movement configuration to validate.
 * @param {string} prefix - Enemy-specific error prefix.
 */
function validateMovementProfileValues(movement, prefix) {
    if (movement.profile === 'waveLeft') {
        validatePositiveMovementValue(movement.waveAmplitude,
            `${prefix}.waveAmplitude`);
        validatePositiveMovementValue(movement.waveFrequency,
            `${prefix}.waveFrequency`);
        return;
    }
    validatePositiveMovementValue(movement.verticalSpeed,
        `${prefix}.verticalSpeed`);
    validatePositiveMovementValue(movement.verticalRange,
        `${prefix}.verticalRange`);
}

/**
 * Ensures a movement value is finite and greater than zero.
 * @param {number} value - Numeric value to validate.
 * @param {string} path - Configuration path used in the error message.
 */
function validatePositiveMovementValue(value, path) {
    const isValid = Number.isFinite(value) && value > 0;
    assertLevelConfig(isValid, `${path} must be greater than 0.`);
}

/**
 * Ensures sprite orientation uses a supported value.
 * @param {string} spriteFacing - Configured sprite orientation.
 * @param {string} prefix - Enemy-specific error prefix.
 */
function validateSpriteFacing(spriteFacing, prefix) {
    const allowedValues = ['left', 'right', 'neutral'];
    assertLevelConfig(allowedValues.includes(spriteFacing),
        `${prefix}.spriteFacing is invalid.`);
}

/**
 * Ensures all enemy probabilities add up to one.
 * @param {Object} levelConfig - Parent level configuration.
 * @param {Array<Array>} entries - Enemy type entries to validate.
 */
function validateEnemyWeightSum(levelConfig, entries) {
    const sum = entries.reduce((total, [, config]) => {
        return total + config.weight;
    }, 0);
    const message =
        `Level ${levelConfig.number}: enemy weights must add up to 1.`;
    assertLevelConfig(Math.abs(sum - 1) < 0.0001, message);
}

/**
 * Reads a nested configuration value from a dot-separated path.
 * @param {Object} config - Configuration object to traverse.
 * @param {string} path - Dot-separated property path.
 * @returns {*} Resolved value or undefined when the path is missing.
 */
function getConfigValue(config, path) {
    return path.split('.').reduce((value, key) => value?.[key], config);
}

/**
 * Throws a readable configuration error when a condition fails.
 * @param {boolean} condition - Condition that must evaluate to true.
 * @param {string} message - Error message without the shared prefix.
 * @throws {Error} If the condition evaluates to false.
 */
function assertLevelConfig(condition, message) {
    if (!condition) {
        throw new Error(`[LEVEL_CONFIG] ${message}`);
    }
}

validateLevelConfigs();