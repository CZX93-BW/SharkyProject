'use strict';

const LEVEL_TWO_CONFIG = getLevelConfig(2);

LEVELS[2] = createLevelTwo();

/** @returns {Level} Level two built from its validated configuration. */
function createLevelTwo() {
    return new Level({
        number: LEVEL_TWO_CONFIG.number,
        config: LEVEL_TWO_CONFIG,
        width: LEVEL_TWO_CONFIG.world.width,
        height: LEVEL_TWO_CONFIG.world.height,
        backgroundObjects: createLevelTwoBackgrounds(),
        barrierObjects: createLevelTwoBarriers(),
        solidAreas: createLevelTwoSolidAreas(),
        enemies: [],
        collectibles: createLevelTwoCollectibles(),
        endboss: createLevelTwoEndboss(),
        finishObject: createLevelTwoFinishObject()
    });
}

/** @returns {BarrierObject[]} All solid barrier objects for level two. */
function createLevelTwoBarriers() {
    return [
        createLevelTwoFloorBarrier(1320),
        createLevelTwoVerticalBarrier(1940),
        createLevelTwoFloorBarrier(3160),
        createLevelTwoVerticalBarrier(4230)
    ];
}

/**
 * @param {number} x - Horizontal world position.
 * @returns {BarrierObject} Floor rock barrier.
 */
function createLevelTwoFloorBarrier(x) {
    return new BarrierObject({
        x,
        y: 440,
        width: 340,
        height: 150,
        imagePath: ASSET_CONFIG.levelObjects.barriers.floorRock,
        collisionInset: {
            left: 22,
            right: 22,
            top: 28
        }
    });
}

/**
 * @param {number} x - Horizontal world position.
 * @returns {BarrierObject} Vertical rock barrier.
 */
function createLevelTwoVerticalBarrier(x) {
    return new BarrierObject({
        x,
        y: 170,
        width: 110,
        height: 300,
        imagePath: ASSET_CONFIG.levelObjects.barriers.verticalRock,
        collisionInset: {
            left: 16,
            right: 16,
            top: 14,
            bottom: 14
        }
    });
}

/** @returns {BackgroundObject[]} Five parallax background layers. */
function createLevelTwoBackgrounds() {
    return [
        createLevelTwoLayer('far', '#031c30', 0.15, 1),
        createLevelTwoLayer('back', '#04283d', 0.3, 1),
        createLevelTwoLayer('middle', 'rgba(8, 89, 126, 0.44)', 0.55, 1),
        createLevelTwoLayer('front', 'rgba(5, 58, 86, 0.28)', 0.85, 1),
        createLevelTwoLayer('floor', 'rgba(1, 25, 39, 0.78)', 1, 1)
    ];
}

/**
 * @param {string} layerName - Asset name of the background layer.
 * @param {string} fallbackColor - Color used while the image is unavailable.
 * @param {number} scrollFactor - Layer parallax movement factor.
 * @param {number} opacity - Layer rendering opacity.
 * @returns {BackgroundObject} Configured parallax background layer.
 */
function createLevelTwoLayer(layerName, fallbackColor, scrollFactor, opacity) {
    const world = LEVEL_TWO_CONFIG.world;
    return new BackgroundObject(0, 0, world.width, world.height, {
        imagePath: ASSET_CONFIG.backgrounds.levelTwo[layerName],
        fallbackColor,
        tileWidth: world.backgroundTileWidth,
        scrollFactor,
        opacity
    });
}

/** @returns {Object[]} Level floor collision area. */
function createLevelTwoSolidAreas() {
    const world = LEVEL_TWO_CONFIG.world;
    return [{
        x: 0,
        y: world.height - world.floorHeight,
        width: world.width,
        height: world.floorHeight
    }];
}

/** @returns {CollectibleObject[]} All level-two collectibles. */
function createLevelTwoCollectibles() {
    return [
        createLevelTwoCoin(420, 230),
        createLevelTwoCoin(1510, 350),
        createLevelTwoCoin(2660, 185),
        createLevelTwoCoin(3680, 350),
        createLevelTwoCoin(4720, 170),
        createLevelTwoPoisonBottle(820, 320),
        createLevelTwoPoisonBottle(1830, 220),
        createLevelTwoPoisonBottle(2830, 310),
        createLevelTwoPoisonBottle(3920, 200),
        createLevelTwoPoisonBottle(4900, 320)
    ];
}

/**
 * @param {number} x - Horizontal world position.
 * @param {number} y - Vertical world position.
 * @returns {CollectibleObject} Animated coin collectible.
 */
function createLevelTwoCoin(x, y) {
    return new CollectibleObject({
        x,
        y,
        type: 'coin',
        width: GAME_CONFIG.coinWidth,
        height: GAME_CONFIG.coinHeight,
        value: GAME_CONFIG.coinValue,
        imagePath: ASSET_CONFIG.collectibles.coin,
        animationImages: ASSET_CONFIG.collectibles.coinAnimation,
        fallbackColor: GAME_CONFIG.coinFallbackColor
    });
}

/**
 * @param {number} x - Horizontal world position.
 * @param {number} y - Vertical world position.
 * @returns {CollectibleObject} Animated poison bottle collectible.
 */
function createLevelTwoPoisonBottle(x, y) {
    return new CollectibleObject({
        x,
        y,
        type: 'poisonBottle',
        width: GAME_CONFIG.poisonBottleWidth,
        height: GAME_CONFIG.poisonBottleHeight,
        value: GAME_CONFIG.poisonBottleValue,
        imagePath: ASSET_CONFIG.collectibles.poisonBottle,
        animationImages: ASSET_CONFIG.collectibles.poisonBottleAnimation,
        fallbackColor: GAME_CONFIG.poisonBottleFallbackColor
    });
}

/** @returns {Endboss} Configured level-two boss. */
function createLevelTwoEndboss() {
    const boss = LEVEL_TWO_CONFIG.boss;
    return new Endboss({
        ...boss,
        x: LEVEL_TWO_CONFIG.world.width - boss.rightOffset
    });
}

/** @returns {FinishObject} Configured level finish object. */
function createLevelTwoFinishObject() {
    const world = LEVEL_TWO_CONFIG.world;
    const finish = LEVEL_TWO_CONFIG.finish;
    return new FinishObject(
        world.width - finish.rightOffset,
        world.height - finish.bottomOffset
    );
}