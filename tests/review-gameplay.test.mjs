import assert from 'node:assert/strict';
import test from 'node:test';
import { createScriptContext, loadProjectScripts, readProjectFile } from './test-helpers.mjs';

/** Loads the game's real scripts in page order with a controllable animation clock. */
function createWorld() {
    let time = 1000;
    const context = createScriptContext({
        Image: class {},
        window: { location: { search: '' } },
        performance: { now: () => time }
    });
    const paths = [...readProjectFile('index.html').matchAll(/<script src="([^"?]+)/g)]
        .map((match) => match[1]).filter((path) => path !== 'js/main.js');
    loadProjectScripts(context, paths, 'this.api = { GameState, EnemyFactory, FinSlap, ' +
        'RandomGenerator, PoisonShot, BubbleTrap, CollisionManager };');
    return { ...context.api, tick: (ms) => { time += ms; } };
}

/** Creates reproducible enemies from the actual level configuration. */
function createFactory(world, level) {
    return new world.EnemyFactory(level.config, new world.RandomGenerator(() => 0.5));
}

test('retry resets inventory and pickups, while shop upgrades survive a level-two retry', () => {
    const state = enterLevelTwoWithUpgrades();
    const speed = state.player.speed;
    state.activeLevel.collectibles[0].collect();
    state.setGameOver();
    state.restartCurrentLevel();
    assert.deepEqual([state.coins, state.poisonBottles, state.currentLevel], [0, 0, 2]);
    assert.equal(state.usePoisonBottle(), false);
    assert.equal(state.player.speed, speed);
    assert.equal(state.activeLevel.collectibles[0].isCollected, false);
    state.start(1);
    assert.equal(state.isUpgradeOwned('speedBoost'), false);
});

/** Enters level two through the shop path with coins, poison and a speed upgrade. */
function enterLevelTwoWithUpgrades() {
    const world = createWorld();
    const state = new world.GameState();
    state.start(1);
    state.collectCoin(5);
    state.collectPoisonBottle(2);
    assert.ok(state.purchaseUpgrade('speedBoost'));
    state.startNextLevel(2);
    assert.deepEqual([state.coins, state.poisonBottles], [3, 2]);
    return state;
}

for (const number of [1, 2]) {
    for (const type of ['pufferFish', 'jellyFish']) {
        test(type + ' clears every rock in level ' + number, () => {
            const world = createWorld();
            const level = new world.GameState().getLevelByNumber(number);
            const factory = createFactory(world, level);
            for (const rock of level.barrierObjects) {
                const area = rock.getSolidArea();
                assertClearsRock(factory, type, level, area, area.y + 8);
                const midY = Math.min(area.y + area.height / 2, level.height - 230);
                assertClearsRock(factory, type, level, area, midY);
            }
        });
    }
}

/** Requires progress past the rock without tunnelling or leaving the level. */
function assertClearsRock(factory, type, level, rock, startY) {
    const right = rock.x + rock.width;
    const enemy = factory.create(type, right + 3, startY);
    for (let frame = 0; frame < 2200 && enemy.x + enemy.width > rock.x; frame++) {
        enemy.updateMovementWithSolidAreas(level.solidAreas);
        assert.equal(enemy.findSolidArea(level.solidAreas), undefined);
        assert.ok(enemy.y >= 0);
        assert.ok(enemy.y + enemy.height <= level.height - level.config.world.floorHeight);
    }
    assert.ok(enemy.x + enemy.width <= rock.x);
}

for (const direction of [-1, 1]) {
    test('fin contact follows the visible swing facing ' + direction, () => {
        const { world, player, slap, target, combat } = prepareStrike(direction);
        placeAtTip(slap, target, direction, -2);
        assert.equal(combat.canAttackHitTarget(slap, target), false);
        world.tick(240);
        player.updateAnimation();
        player.x += 15;
        slap.update();
        assertMeleeReach(player, slap, target, combat);
        world.tick(180);
        player.updateAnimation();
        slap.update();
        assert.ok(slap.isExpired);
    });
}

/** Starts the real attack animation against a level-one pufferfish. */
function prepareStrike(direction) {
    const world = createWorld();
    const state = new world.GameState();
    const player = state.player;
    player.direction = direction;
    player.startFinSlap();
    const slap = new world.FinSlap(player);
    const factory = createFactory(world, state.activeLevel);
    const target = factory.create('pufferFish', 0, player.y);
    return { world, player, slap, target, combat: new world.CollisionManager(), state };
}

/** Checks melee reach from Sharky's body, independently of the attack rectangle. */
function assertMeleeReach(player, slap, target, combat) {
    const direction = player.direction;
    const front = direction === 1 ? player.x + player.width : player.x;
    placeAtEdge(front, target, direction, 40);
    assert.equal(combat.canAttackHitTarget(slap, target), false);
    placeAtEdge(front, target, direction, 24);
    assert.equal(combat.canEnemyDamagePlayer(player, target), false);
    combat.checkAttackTarget(slap, target);
    assert.equal(target.health, target.maxHealth - slap.damage);
    assert.equal(combat.canAttackHitTarget(slap, target), false);
}

/** Places the nearest edge of the enemy body at a signed distance from the fin. */
function placeAtTip(slap, target, direction, gap) {
    const tip = direction === 1 ? slap.x + slap.width : slap.x;
    placeAtEdge(tip, target, direction, gap);
}

/** Aligns the near edge of a target's combat body relative to a world position. */
function placeAtEdge(tip, target, direction, gap) {
    const body = target.getCombatBounds();
    const edge = direction === 1 ? body.x : body.x + body.width;
    target.x += tip + direction * gap - edge;
}

for (const kind of ['PoisonShot', 'BubbleTrap']) {
    test(kind + ' affects only the first of two overlapping targets', () => {
        const world = createWorld();
        const state = new world.GameState();
        const factory = createFactory(world, state.activeLevel);
        const shot = new world[kind](state.player);
        const targets = [0, 1].map(() => factory.create('pufferFish', shot.x, shot.y));
        new world.CollisionManager().checkAttackTargets(shot, targets);
        assert.equal(shot.isExpired, true);
        assert.ok(targets[0].isPoisoned() || targets[0].isTrapped());
        assert.equal(targets[1].health, targets[1].maxHealth);
        assert.equal(targets[1].isTrapped(), false);
        if (kind === 'BubbleTrap') {
            assert.equal(targets[0].canDealContactDamage(), false);
            assert.equal(state.activeLevel.endboss.canBeTrapped(), false);
        }
    });
}

test('the boss takes fin damage only within its visible body', () => {
    const { world, player, slap, combat, state } = prepareStrike(1);
    const boss = state.activeLevel.endboss;
    world.tick(240);
    player.updateAnimation();
    slap.update();
    placeAtTip(slap, boss, player.direction, -2);
    boss.y = slap.y;
    combat.checkAttackTarget(slap, boss);
    assert.equal(boss.health, boss.maxHealth);
    boss.y -= boss.getCombatBounds().y - boss.y;
    combat.checkAttackTarget(slap, boss);
    assert.equal(boss.health, boss.maxHealth - slap.damage);
});
