import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** @returns {Object} Renderer with a recording canvas context. */
function createRendererEnvironment() {
    const context = { drawnImages: [] };
    const scriptContext = createStatusRendererContext(context);

    loadProjectScripts(
        scriptContext,
        ['js/game/game-status-renderer.class.js'],
        'this.GameStatusRendererExport = GameStatusRenderer;'
    );

    return {
        context,
        renderer: new scriptContext.GameStatusRendererExport(
            { width: 960 },
            context
        )
    };
}

/**
 * @param {Object} context - Recording rendering context.
 * @returns {vm.Context} Status-renderer test context.
 */
function createStatusRendererContext(context) {
    class FakeDrawableObject {
        /** Creates a drawable test object with rectangular bounds. */
        constructor(x, y, width, height) {
            Object.assign(this, {
                x,
                y,
                width,
                height
            });
        }

        /**
         * @param {string} path - Fake image path.
         * @returns {string} Unchanged fake image path.
         */
        getCachedImage(path) {
            return path;
        }

        /** @param {Object} targetContext - Recording context. */
        draw(targetContext) {
            targetContext.drawnImages.push(this.image);
        }
    }

    return createScriptContext({
        ASSET_CONFIG: createStatusAssets(),
        DrawableObject: FakeDrawableObject,
        context
    });
}

/** @returns {Object} Six image states for every status bar. */
function createStatusAssets() {
    const images = ['0', '20', '40', '60', '80', '100'];

    return {
        ui: {
            statusBars: {
                health: images,
                coins: images,
                poison: images,
                bossHealth: images
            }
        }
    };
}

/** @returns {Object} Game state containing player, level, and boss values. */
function createGameState() {
    return {
        player: {
            health: 50,
            maxHealth: 100
        },
        coins: 1,
        poisonBottles: 2,
        getMaxPoisonBottles: () => 5,
        activeLevel: {
            collectibles: [
                { type: 'coin' },
                { type: 'coin' }
            ],
            endboss: {
                health: 50,
                maxHealth: 100,
                hasBeenIntroduced: false,
                isDefeated: false
            }
        }
    };
}

test('status renderer synchronizes player status values', () => {
    const environment = createRendererEnvironment();
    const gameState = createGameState();

    environment.renderer.draw(gameState);

    const bars = environment.renderer.statusBars;
    assert.equal(bars.health.percentage, 50);
    assert.equal(bars.coins.percentage, 50);
    assert.equal(bars.poison.percentage, 40);
});

test('boss bar appears only after the boss introduction', () => {
    const environment = createRendererEnvironment();
    const gameState = createGameState();

    environment.renderer.draw(gameState);
    assert.equal(environment.context.drawnImages.length, 3);

    gameState.activeLevel.endboss.hasBeenIntroduced = true;
    environment.renderer.draw(gameState);
    assert.equal(environment.context.drawnImages.length, 7);
});