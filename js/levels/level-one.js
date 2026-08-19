'use strict';

const LEVELS = {};
const LEVEL_ONE_CONFIG = getLevelConfig(1);

LEVELS[1] = createLevelOne();

/** Creates level one from its validated configuration. */
function createLevelOne() {
    return new Level({
        number: LEVEL_ONE_CONFIG.number,
        config: LEVEL_ONE_CONFIG,
        width: LEVEL_ONE_CONFIG.world.width,
        height: LEVEL_ONE_CONFIG.world.height,
        backgroundObjects: createLevelOneBackgrounds(),
        barrierObjects: createLevelOneBarriers(),
        solidAreas: createLevelOneSolidAreas(),
        enemies: [],
        collectibles: createLevelOneCollectibles(),
        endboss: createLevelOneEndboss(),
        finishObject: createLevelOneFinishObject()
    });
}

/** Creates all solid barrier objects for level one. */
function createLevelOneBarriers() {
    return [
        createLevelOneFloorBarrier(),
        createLevelOneVerticalBarrier()
    ];
}

/** Creates the floor rock barrier. */
function createLevelOneFloorBarrier() {
    return new BarrierObject({
        x: 650,
        y: 470,
        width: 280,
        height: 130,
        imagePath: ASSET_CONFIG.levelObjects.barriers.floorRock,
        collisionInset: {
            left: 18,
            right: 18,
            top: 24
        }
    });
}

/** Creates the vertical rock barrier. */
function createLevelOneVerticalBarrier() {
    return new BarrierObject({
        x: 1160,
        y: 190,
        width: 100,
        height: 270,
        imagePath: ASSET_CONFIG.levelObjects.barriers.verticalRock,
        collisionInset: {
            left: 15,
            right: 15,
            top: 12,
            bottom: 12
        }
    });
}

/** Creates the five parallax background layers. */
function createLevelOneBackgrounds() {
    return [
        createLevelOneLayer('far', '#05273d', 0.15, 1),
        createLevelOneLayer('back', '#06354f', 0.3, 1),
        createLevelOneLayer('middle', 'rgba(14, 118, 148, 0.42)', 0.55, 1),
        createLevelOneLayer('front', 'rgba(24, 157, 185, 0.22)', 0.85, 1),
        createLevelOneLayer('floor', 'rgba(2, 34, 44, 0.75)', 1, 1)
    ];
}

/** Creates one configured parallax layer. */
function createLevelOneLayer(layerName, fallbackColor, scrollFactor, opacity) {
    const world = LEVEL_ONE_CONFIG.world;
    return new BackgroundObject(0, 0, world.width, world.height, {
        imagePath: ASSET_CONFIG.backgrounds.levelOne[layerName],
        fallbackColor,
        scrollFactor,
        opacity
    });
}

/** Creates the level floor collision area. */
function createLevelOneSolidAreas() {
    const world = LEVEL_ONE_CONFIG.world;
    return [{
        x: 0,
        y: world.height - world.floorHeight,
        width: world.width,
        height: world.floorHeight
    }];
}

/** Creates all collectibles for level one. */
function createLevelOneCollectibles() {
    return [
        createLevelOneCoin(310, 210),
        createLevelOneCoin(620, 300),
        createLevelOneCoin(1040, 230),
        createLevelOneCoin(1460, 310),
        createLevelOneCoin(1900, 230),
        createLevelOnePoisonBottle(780, 210),
        createLevelOnePoisonBottle(1580, 260)
    ];
}

/** Creates one animated coin. */
function createLevelOneCoin(x, y) {
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

/** Creates one animated poison bottle. */
function createLevelOnePoisonBottle(x, y) {
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

/** Creates the configured level-one boss. */
function createLevelOneEndboss() {
    const boss = LEVEL_ONE_CONFIG.boss;
    return new Endboss({
        ...boss,
        x: LEVEL_ONE_CONFIG.world.width - boss.rightOffset
    });
}

/** Creates the level finish object. */
function createLevelOneFinishObject() {
    const world = LEVEL_ONE_CONFIG.world;
    const finish = LEVEL_ONE_CONFIG.finish;
    return new FinishObject(
        world.width - finish.rightOffset,
        world.height - finish.bottomOffset
    );
}