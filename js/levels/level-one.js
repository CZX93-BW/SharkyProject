'use strict';

const LEVELS = {};

LEVELS[1] = createLevelOne();

function createLevelOne() {
    return new Level({
        number: 1,
        width: GAME_CONFIG.levelOneWidth,
        height: GAME_CONFIG.levelHeight,
        backgroundObjects: createLevelOneBackgrounds(),
        barrierObjects: createLevelOneBarriers(),
        solidAreas: createLevelOneSolidAreas(),
        enemies: createLevelOneEnemies(),
        collectibles: createLevelOneCollectibles(),
        endboss: createLevelOneEndboss(),
        finishObject: createLevelOneFinishObject()
    });
}

function createLevelOneBarriers() {
    return [
        createLevelOneFloorBarrier(),
        createLevelOneVerticalBarrier()
    ];
}

function createLevelOneFloorBarrier() {
    return new BarrierObject({
        x: 650,
        y: 470,
        width: 280,
        height: 130,
        imagePath:
            ASSET_CONFIG.levelObjects.barriers.floorRock,
        collisionInset: {
            left: 18,
            right: 18,
            top: 24
        }
    });
}

function createLevelOneVerticalBarrier() {
    return new BarrierObject({
        x: 1160,
        y: 190,
        width: 100,
        height: 270,
        imagePath:
            ASSET_CONFIG.levelObjects.barriers.verticalRock,
        collisionInset: {
            left: 15,
            right: 15,
            top: 12,
            bottom: 12
        }
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
    return createLevelOneLayer(
        'far',
        0,
        GAME_CONFIG.levelHeight,
        '#05273d',
        0.15,
        1
    );
}

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
            imagePath:
                ASSET_CONFIG.backgrounds
                    .levelOne[layerName],
            fallbackColor,
            scrollFactor,
            opacity
        }
    );
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
            'jellyFishYellow'
        )
    ];
}

function createLevelOneEnemy(
    x,
    y,
    axis,
    type
) {
    const size =
        getLevelOneEnemySize(type);

    return new Enemy({
        x,
        y,
        axis,
        type,
        width: size.width,
        height: size.height,
        range:
            GAME_CONFIG.enemyPatrolRange
    });
}

function getLevelOneEnemySize(type) {
    if (type.startsWith('jellyFish')) {
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
        imagePath:
            ASSET_CONFIG.collectibles.coin,
        animationImages:
            ASSET_CONFIG.collectibles
                .coinAnimation,
        fallbackColor:
            GAME_CONFIG.coinFallbackColor
    });
}

function createLevelOnePoisonBottle(x, y) {
    return new CollectibleObject({
        x,
        y,
        type: 'poisonBottle',
        width:
            GAME_CONFIG.poisonBottleWidth,
        height:
            GAME_CONFIG.poisonBottleHeight,
        value:
            GAME_CONFIG.poisonBottleValue,
        imagePath:
            ASSET_CONFIG.collectibles
                .poisonBottle,
        animationImages:
            ASSET_CONFIG.collectibles
                .poisonBottleAnimation,
        fallbackColor:
            GAME_CONFIG
                .poisonBottleFallbackColor
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