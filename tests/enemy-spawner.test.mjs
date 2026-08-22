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

/** Creates a level with deterministic spawn configuration. */
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

/** Creates the spawner and enemy-type settings used by tests. */
function createLevelConfig() {
    return {
        world: { floorHeight: 120 },
        spawner: {
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
        },
        enemyTypes: {
            pufferFish: {
                weight: 1,
                width: 58,
                height: 58,
                movement: { profile: 'waveLeft', waveAmplitude: 34 }
            }
        }
    };
}

/** Creates the deterministic collaborators injected into the spawner. */
function createSpawner(level) {
    const random = {
        between: (minimum) => minimum,
        integer: () => 0,
        pickWeighted: (entries) => entries[0]
    };
    const factory = { create: () => createActiveEnemy() };
    return new context.EnemySpawnerExport(level, factory, random);
}

/** Creates one active enemy suitable for lifecycle filtering. */
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

/** Replaces placement details while retaining budget lifecycle logic. */
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
    level.enemies = [createActiveEnemy(), createActiveEnemy(), createActiveEnemy()];
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
