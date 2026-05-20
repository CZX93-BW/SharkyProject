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
        createLevelOneBackBackground(),
        createLevelOneMiddleBackground(),
        createLevelOneFrontBackground()
    ];
}

function createLevelOneBackBackground() {
    return new BackgroundObject(0, 0, GAME_CONFIG.levelOneWidth, GAME_CONFIG.levelHeight, ASSET_CONFIG.backgrounds.levelOne.back, '#06354f', 0.25);
}

function createLevelOneMiddleBackground() {
    return new BackgroundObject(0, 0, GAME_CONFIG.levelOneWidth, GAME_CONFIG.levelHeight, ASSET_CONFIG.backgrounds.levelOne.middle, 'rgba(14, 118, 148, 0.42)', 0.55);
}

function createLevelOneFrontBackground() {
    return new BackgroundObject(0, GAME_CONFIG.levelHeight - 120, GAME_CONFIG.levelOneWidth, 120, ASSET_CONFIG.backgrounds.levelOne.front, 'rgba(2, 34, 44, 0.75)', 1);
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