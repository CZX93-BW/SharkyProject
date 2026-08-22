import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

const context = createScriptContext();
loadProjectScripts(
    context,
    ['js/config/game-config.js', 'js/config/level-config.js'],
    `globalThis.testConfig = {
        GAME_CONFIG,
        LEVEL_CONFIG,
        validateLevelConfigs
    };`
);

const { GAME_CONFIG, LEVEL_CONFIG, validateLevelConfigs } = context.testConfig;

test('all level configurations pass validation', () => {
    assert.equal(validateLevelConfigs(), true);
});

test('enemy weights equal one in every level', () => {
    Object.values(LEVEL_CONFIG).forEach((level) => {
        const weight = Object.values(level.enemyTypes)
            .reduce((sum, enemy) => sum + enemy.weight, 0);
        assert.ok(Math.abs(weight - 1) < 0.0001);
    });
});

test('level two increases enemy and boss difficulty', () => {
    const levelOne = LEVEL_CONFIG[1];
    const levelTwo = LEVEL_CONFIG[2];
    assert.ok(levelTwo.spawner.maxActiveEnemies > levelOne.spawner.maxActiveEnemies);
    assert.ok(levelTwo.spawner.totalEnemyBudget > levelOne.spawner.totalEnemyBudget);
    assert.ok(levelTwo.boss.health > levelOne.boss.health);
    assert.ok(levelTwo.boss.aggression > levelOne.boss.aggression);
});

test('boss size is forty percent above the original base size', () => {
    const expectedWidth = GAME_CONFIG.endbossWidth * 1.4;
    const expectedHeight = GAME_CONFIG.endbossHeight * 1.4;
    assert.equal(LEVEL_CONFIG[1].boss.width, expectedWidth);
    assert.equal(LEVEL_CONFIG[1].boss.height, expectedHeight);
    assert.equal(LEVEL_CONFIG[2].boss.width, expectedWidth);
    assert.equal(LEVEL_CONFIG[2].boss.height, expectedHeight);
});
