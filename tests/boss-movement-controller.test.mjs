import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

const context = createScriptContext();
loadProjectScripts(
    context,
    ['js/systems/boss-movement-controller.class.js'],
    'globalThis.BossMovementControllerExport = BossMovementController;'
);

const gameContext = createScriptContext({
    Image: class {
        constructor() {
            this.complete = false;
            this.naturalWidth = 0;
            this.src = '';
        }
    }
});
loadProjectScripts(
    gameContext,
    [
        'js/config/game-config.js',
        'js/config/asset-config.js',
        'js/core/game-clock.class.js',
        'js/core/drawable-object.class.js',
        'js/core/movable-object.class.js',
        'js/core/animated-drawable-object.class.js',
        'js/systems/enemy-movement-controller.class.js',
        'js/entities/enemies/enemy.class.js',
        'js/systems/boss-movement-controller.class.js',
        'js/entities/enemies/endboss.class.js'
    ],
    'globalThis.EndbossExport = Endboss;'
);

/** Creates the boss values required by the movement controller. */
function createBoss(direction) {
    return {
        x: 100,
        y: 100,
        startX: 100,
        startY: 100,
        width: 140,
        height: 110,
        speed: 2,
        range: 20,
        axis: 'vertical',
        direction,
        isTouchingSolidArea: () => false,
        restorePosition(previousPosition) {
            this.x = previousPosition.x;
            this.y = previousPosition.y;
        },
        keepInsideBounds() {}
    };
}

test('boss sprite mirrors only when facing right', () => {
    const leftController = new context.BossMovementControllerExport(
        createBoss(-1)
    );
    const rightController = new context.BossMovementControllerExport(
        createBoss(1)
    );
    leftController.faceTargetX(0);
    rightController.faceTargetX(1000);

    assert.equal(leftController.shouldMirrorSprite(), false);
    assert.equal(rightController.shouldMirrorSprite(), true);
});

test('boss controller reset restores its shared enemy interface state', () => {
    const boss = createBoss(1);
    const controller = new context.BossMovementControllerExport(boss);
    controller.patrolDirection = -1;
    boss.direction = 1;

    controller.reset();

    assert.equal(boss.direction, -1);
    assert.equal(controller.patrolDirection, 1);
});

test('vertical boss patrol advances around its configured home point', () => {
    const boss = createBoss(-1);
    const controller = new context.BossMovementControllerExport(boss);

    controller.updatePatrol([], null);

    assert.equal(boss.x, 100);
    assert.equal(boss.y, 102);
});

test('endboss resets and enters idle patrol without interface errors', () => {
    const boss = new gameContext.EndbossExport({
        x: 2000,
        y: 250,
        speed: 1.1,
        patrolRange: 170,
        axis: 'vertical'
    });
    boss.x = 2100;
    boss.y = 300;

    boss.reset();
    assert.doesNotThrow(() => {
        boss.update(null, [], {
            left: 0,
            top: 0,
            right: 2400,
            bottom: 720
        });
    });

    assert.equal(boss.x, boss.startX);
    assert.ok(boss.y > boss.startY);
    assert.equal(boss.speed, 1.1);
    assert.equal(boss.range, 170);
});