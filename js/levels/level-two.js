'use strict';

LEVELS[2] = createLevelTwo();

function createLevelTwo() {
    return new Level({
        number: 2,
        width: GAME_CONFIG.levelTwoWidth,
        height: GAME_CONFIG.levelHeight,
        backgroundObjects: createLevelTwoBackgrounds(),
        solidAreas: createLevelTwoSolidAreas(),
        enemies: createLevelTwoEnemies(),
        collectibles: createLevelTwoCollectibles(),
        endboss: createLevelTwoEndboss(),
        finishObject: createLevelTwoFinishObject()
    });
}

function createLevelTwoBackgrounds() {
    return [
        createLevelTwoBackBackground(),
        createLevelTwoMiddleBackground(),
        createLevelTwoFrontBackground()
    ];
}

function createLevelTwoBackBackground() {
    return new BackgroundObject(0, 0, GAME_CONFIG.levelTwoWidth, GAME_CONFIG.levelHeight, ASSET_CONFIG.backgrounds.levelTwo.back, '#04283d', 0.25);
}

function createLevelTwoMiddleBackground() {
    return new BackgroundObject(0, 0, GAME_CONFIG.levelTwoWidth, GAME_CONFIG.levelHeight, ASSET_CONFIG.backgrounds.levelTwo.middle, 'rgba(8, 89, 126, 0.44)', 0.55);
}

function createLevelTwoFrontBackground() {
    return new BackgroundObject(0, GAME_CONFIG.levelHeight - 130, GAME_CONFIG.levelTwoWidth, 130, ASSET_CONFIG.backgrounds.levelTwo.front, 'rgba(1, 25, 39, 0.78)', 1);
}

function createLevelTwoSolidAreas() {
    return [
        {
            x: 0,
            y: GAME_CONFIG.levelHeight - 130,
            width: GAME_CONFIG.levelTwoWidth,
            height: 130
        }
    ];
}

function createLevelTwoEnemies() {
    return [
        createLevelTwoEnemy(620, 250, 'vertical'),
        createLevelTwoEnemy(1160, 310, 'horizontal'),
        createLevelTwoEnemy(1740, 220, 'vertical'),
        createLevelTwoEnemy(2180, 360, 'horizontal')
    ];
}

function createLevelTwoEnemy(x, y, axis) {
    return new Enemy({
        x,
        y,
        axis,
        range: GAME_CONFIG.enemyPatrolRange + 40,
        speed: GAME_CONFIG.enemySpeed + 0.25
    });
}

function createLevelTwoCollectibles() {
    return [
        createLevelTwoCoin(420, 230),
        createLevelTwoCoin(820, 320),
        createLevelTwoCoin(1340, 260),
        createLevelTwoCoin(1880, 210),
        createLevelTwoCoin(2380, 340),
        createLevelTwoPoisonBottle(1040, 220),
        createLevelTwoPoisonBottle(2040, 280),
        createLevelTwoPoisonBottle(2520, 250)
    ];
}

function createLevelTwoCoin(x, y) {
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

function createLevelTwoPoisonBottle(x, y) {
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

function createLevelTwoEndboss() {
    return new Endboss({
        x: GAME_CONFIG.levelTwoWidth - 500,
        y: 230,
        axis: 'vertical',
        range: GAME_CONFIG.endbossPatrolRange + 70,
        speed: GAME_CONFIG.endbossSpeed + 0.35
    });
}

function createLevelTwoFinishObject() {
    return new FinishObject(
        GAME_CONFIG.levelTwoWidth - 120,
        GAME_CONFIG.levelHeight - 300
    );
}