import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

const context = createScriptContext();
loadProjectScripts(
    context,
    ['js/systems/enemy-spawner.class.js'],
    'globalThis.EnemySpawnerExport = EnemySpawner;'
);

/** @returns {Object} Level with deterministic spawn configuration. */
function createLevel() {
    return {
        width: 2400,
        height: 720,
        enemies: [],
        collectibles: [],
        solidAreas: [],
        endboss: { isIntroducing: false },
        hasActiveEndboss: () => false,
        config: createLevelConfig()
    };
}

/** @returns {Object} Complete deterministic level configuration. */
function createLevelConfig() {
    return {
        world: { floorHeight: 120 },
        spawner: createSpawnerConfig(),
        enemyTypes: createEnemyTypeConfig()
    };
}

/** @returns {Object} Deterministic enemy-spawner settings. */
function createSpawnerConfig() {
    return {
        initialCount: 2,
        maxActiveEnemies: 3,
        totalEnemyBudget: 3,
        spawnInterval: { min: 100, max: 100 },
        minimumPlayerDistance: 320,
        minimumEnemyDistance: 120,
        viewportOffset: 160,
        despawnBuffer: 180,
        bossZoneBuffer: 520,
        pauseDuringBoss: true
    };
}

/** @returns {Object} Weighted pufferfish configuration. */
function createEnemyTypeConfig() {
    return {
        pufferFish: {
            weight: 1,
            width: 58,
            height: 58,
            movement: {
                profile: 'waveLeft',
                waveAmplitude: 34
            }
        }
    };
}

/**
 * @param {Object} level - Level receiving spawned enemies.
 * @returns {EnemySpawner} Spawner with deterministic collaborators.
 */
function createSpawner(level) {
    const random = {
        between: (minimum) => minimum,
        integer: () => 0,
        pickWeighted: (entries) => entries[0]
    };
    const factory = { create: () => createActiveEnemy() };
    return new context.EnemySpawnerExport(level, factory, random);
}

/** @returns {Object} Active enemy suitable for lifecycle filtering. */
function createActiveEnemy() {
    return {
        x: 100,
        y: 100,
        width: 58,
        height: 58,
        isDefeated: false,
        isAnimationFinished: () => false
    };
}

/** @param {EnemySpawner} spawner - Spawner to make deterministic. */
function useDeterministicSpawn(spawner) {
    spawner.spawnEnemy = () => {
        spawner.level.enemies.push(createActiveEnemy());
        spawner.spawnedCount += 1;
        return true;
    };
}

test('initial population and respawn respect the total budget', () => {
    const level = createLevel();
    const spawner = createSpawner(level);
    const player = { x: 100, y: 100, width: 78, height: 48 };
    const bounds = { left: 0, right: 960, top: 0, bottom: 540 };

    useDeterministicSpawn(spawner);
    spawner.update(player, bounds, 1000);
    assert.equal(level.enemies.length, 2);

    spawner.update(player, bounds, 1100);
    assert.equal(level.enemies.length, 3);

    level.enemies.pop();
    spawner.update(player, bounds, 1200);
    assert.equal(spawner.spawnedCount, 3);
});

test('active enemy cap prevents additional spawning', () => {
    const level = createLevel();
    const spawner = createSpawner(level);
    level.enemies = [
        createActiveEnemy(),
        createActiveEnemy(),
        createActiveEnemy()
    ];
    spawner.spawnedCount = 2;
    const player = { x: 100, width: 78 };

    assert.equal(spawner.canSpawnEnemy(player, 1000), false);
});

test('spawning pauses when the player enters the boss zone', () => {
    const level = createLevel();
    const spawner = createSpawner(level);
    const player = { x: 1850, width: 78 };

    assert.equal(spawner.shouldPauseSpawning(player), true);
});

test('escaped and completed enemies are removed', () => {
    const level = createLevel();
    const spawner = createSpawner(level);
    const escaped = { ...createActiveEnemy(), x: -300 };
    const defeated = {
        ...createActiveEnemy(),
        isDefeated: true,
        isAnimationFinished: () => true
    };

    level.enemies = [escaped, defeated, createActiveEnemy()];
    spawner.removeExpiredEnemies({ left: 0 });

    assert.equal(level.enemies.length, 1);
});