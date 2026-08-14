'use strict';

const LEVELS = {};

LEVELS[1] = createLevelOne();

/** Creates the first game level. */
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

/** Creates all background layers for level one. */
function createLevelOneBackgrounds() {
    return [
        createLevelOneFarLayer(),
        createLevelOneBackLayer(),
        createLevelOneMiddleLayer(),
        createLevelOneFrontLayer(),
        createLevelOneFloorLayer()
    ];
}

/** Creates the far background layer. */
function createLevelOneFarLayer() {
    return createLevelOneLayer(
        'far',
        0,
        GAME_CONFIG.levelHeight,
        '#05273d',
        0.15,
        1
    );
}

/** Creates the rear background layer. */
function createLevelOneBackLayer() {
    return createLevelOneLayer(
        'back',
        0,
        GAME_CONFIG.levelHeight,
        '#06354f',
        0.3,
        1
    );
}

/** Creates the middle background layer. */
function createLevelOneMiddleLayer() {
    return createLevelOneLayer(
        'middle',
        0,
        GAME_CONFIG.levelHeight,
        'rgba(14, 118, 148, 0.42)',
        0.55,
        1
    );
}

/** Creates the foreground light layer. */
function createLevelOneFrontLayer() {
    return createLevelOneLayer(
        'front',
        0,
        GAME_CONFIG.levelHeight,
        'rgba(24, 157, 185, 0.22)',
        0.85,
        1
    );
}

/** Creates the floor layer. */
function createLevelOneFloorLayer() {
    return createLevelOneLayer(
        'floor',
        0,
        GAME_CONFIG.levelHeight,
        'rgba(2, 34, 44, 0.75)',
        1,
        1
    );
}

/** Creates one configured background layer. */
function createLevelOneLayer(
    layerName,
    y,
    height,
    fallbackColor,
    scrollFactor,
    opacity
) {
    return new BackgroundObject(
        0,
        y,
        GAME_CONFIG.levelOneWidth,
        height,
        {
            imagePath: ASSET_CONFIG.backgrounds.levelOne[layerName],
            fallbackColor,
            scrollFactor,
            opacity
        }
    );
}

/** Creates collision areas for level one. */
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

/** Creates all regular enemies for level one. */
function createLevelOneEnemies() {
    return [
        createLevelOneEnemy(
            500,
            250,
            'horizontal',
            'pufferFish'
        ),
        createLevelOneEnemy(
            900,
            310,
            'vertical',
            'jellyFish'
        ),
        createLevelOneEnemy(
            1320,
            250,
            'horizontal',
            'pufferFish'
        ),
        createLevelOneEnemy(
            1700,
            310,
            'vertical',
            'jellyFish'
        )
    ];
}

/** Creates one enemy for level one. */
function createLevelOneEnemy(x, y, axis, type) {
    const size = getLevelOneEnemySize(type);

    return new Enemy({
        x,
        y,
        axis,
        type,
        width: size.width,
        height: size.height,
        range: GAME_CONFIG.enemyPatrolRange
    });
}

/** Returns the correct enemy size. */
function getLevelOneEnemySize(type) {
    if (type === 'jellyFish') {
        return {
            width: 54,
            height: 78
        };
    }

    return {
        width: GAME_CONFIG.enemyWidth,
        height: GAME_CONFIG.enemyHeight
    };
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

/** Creates an animated coin. */
function createLevelOneCoin(x, y) {
    return new CollectibleObject({
        x,
        y,
        type: 'coin',
        width: GAME_CONFIG.coinWidth,
        height: GAME_CONFIG.coinHeight,
        value: GAME_CONFIG.coinValue,
        imagePath: ASSET_CONFIG.collectibles.coin,
        animationImages:
            ASSET_CONFIG.collectibles.coinAnimation,
        fallbackColor: GAME_CONFIG.coinFallbackColor
    });
}

/** Creates an animated poison bottle. */
function createLevelOnePoisonBottle(x, y) {
    return new CollectibleObject({
        x,
        y,
        type: 'poisonBottle',
        width: GAME_CONFIG.poisonBottleWidth,
        height: GAME_CONFIG.poisonBottleHeight,
        value: GAME_CONFIG.poisonBottleValue,
        imagePath: ASSET_CONFIG.collectibles.poisonBottle,
        animationImages:
            ASSET_CONFIG.collectibles.poisonBottleAnimation,
        fallbackColor:
            GAME_CONFIG.poisonBottleFallbackColor
    });
}

/** Creates the endboss for level one. */
function createLevelOneEndboss() {
    return new Endboss({
        x: GAME_CONFIG.levelOneWidth - 420,
        y: 250,
        axis: 'vertical'
    });
}

/** Creates the finish marker for level one. */
function createLevelOneFinishObject() {
    return new FinishObject(
        GAME_CONFIG.levelOneWidth - 120,
        GAME_CONFIG.levelHeight - 290
    );
}