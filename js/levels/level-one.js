'use strict';

const LEVELS = {};

LEVELS[1] = createLevelOne();

function createLevelOne() {
    return new Level({
        number: 1,
        width: GAME_CONFIG.levelOneWidth,
        height: GAME_CONFIG.levelHeight,
        backgroundObjects: createLevelOneBackgrounds(),
        solidAreas: createLevelOneSolidAreas(),
        enemies: createLevelOneEnemies(),
        collectibles: createLevelOneCollectibles(),
        endboss: createLevelOneEndboss(),
        finishObject: createLevelOneFinishObject()
    });
}

function createLevelOneBackgrounds() {
    return [
        createLevelOneFarLayer(),
        createLevelOneBackLayer(),
        createLevelOneMiddleLayer(),
        createLevelOneFrontLayer(),
        createLevelOneFloorLayer()
    ];
}

function createLevelOneFarLayer() {
    return createLevelOneLayer('far', 0, GAME_CONFIG.levelHeight, '#05273d', 0.15, 1);
}

function createLevelOneBackLayer() {
    return createLevelOneLayer('back', 0, GAME_CONFIG.levelHeight, '#06354f', 0.3, 0.86);
}

function createLevelOneMiddleLayer() {
    return createLevelOneLayer('middle', 0, GAME_CONFIG.levelHeight, 'rgba(14, 118, 148, 0.42)', 0.55, 0.72);
}

function createLevelOneFrontLayer() {
    return createLevelOneLayer('front', 0, GAME_CONFIG.levelHeight, 'rgba(24, 157, 185, 0.22)', 0.85, 0.66);
}

function createLevelOneFloorLayer() {
    return createLevelOneLayer('floor', GAME_CONFIG.levelHeight - 120, 120, 'rgba(2, 34, 44, 0.75)', 1, 1);
}

function createLevelOneLayer(layerName, y, height, fallbackColor, scrollFactor, opacity) {
    return new BackgroundObject(0, y, GAME_CONFIG.levelOneWidth, height, {
        imagePath: ASSET_CONFIG.backgrounds.levelOne[layerName],
        fallbackColor,
        scrollFactor,
        opacity
    });
}

function createLevelOneSolidAreas() {
    return [
        {
            x: 0,
            y: GAME_CONFIG.levelHeight - 120,
            width: GAME_CONFIG.levelOneWidth,
            height: 120
        }
    ];
}

function createLevelOneEnemies() {
    return [
        createLevelOneEnemy(500, 250, 'horizontal'),
        createLevelOneEnemy(900, 330, 'vertical'),
        createLevelOneEnemy(1320, 250, 'horizontal'),
        createLevelOneEnemy(1700, 330, 'vertical')
    ];
}

function createLevelOneEnemy(x, y, axis) {
    return new Enemy({
        x,
        y,
        axis,
        range: GAME_CONFIG.enemyPatrolRange
    });
}

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

function createLevelOneCoin(x, y) {
    return new CollectibleObject({
        x,
        y,
        type: 'coin',
        width: GAME_CONFIG.coinWidth,
        height: GAME_CONFIG.coinHeight,
        value: GAME_CONFIG.coinValue,
        imagePath: ASSET_CONFIG.collectibles.coin,
        fallbackColor: GAME_CONFIG.coinFallbackColor
    });
}

function createLevelOnePoisonBottle(x, y) {
    return new CollectibleObject({
        x,
        y,
        type: 'poisonBottle',
        width: GAME_CONFIG.poisonBottleWidth,
        height: GAME_CONFIG.poisonBottleHeight,
        value: GAME_CONFIG.poisonBottleValue,
        imagePath: ASSET_CONFIG.collectibles.poisonBottle,
        fallbackColor: GAME_CONFIG.poisonBottleFallbackColor
    });
}

function createLevelOneEndboss() {
    return new Endboss({
        x: GAME_CONFIG.levelOneWidth - 420,
        y: 250,
        axis: 'vertical'
    });
}

function createLevelOneFinishObject() {
    return new FinishObject(
        GAME_CONFIG.levelOneWidth - 120,
        GAME_CONFIG.levelHeight - 290
    );
}