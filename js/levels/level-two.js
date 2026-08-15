'use strict';

LEVELS[2] = createLevelTwo();

function createLevelTwo() {
    return new Level({
        number: 2,
        width: GAME_CONFIG.levelTwoWidth,
        height: GAME_CONFIG.levelHeight,
        backgroundObjects:
            createLevelTwoBackgrounds(),
        barrierObjects:
            createLevelTwoBarriers(),
        solidAreas:
            createLevelTwoSolidAreas(),
        enemies:
            createLevelTwoEnemies(),
        collectibles:
            createLevelTwoCollectibles(),
        endboss:
            createLevelTwoEndboss(),
        finishObject:
            createLevelTwoFinishObject()
    });
}

function createLevelTwoBarriers() {
    return [
        createLevelTwoFloorBarrier(),
        createLevelTwoVerticalBarrier()
    ];
}

function createLevelTwoFloorBarrier() {
    return new BarrierObject({
        x: 1320,
        y: 440,
        width: 340,
        height: 150,
        imagePath:
            ASSET_CONFIG.levelObjects
                .barriers.floorRock,
        collisionInset: {
            left: 22,
            right: 22,
            top: 28
        }
    });
}

function createLevelTwoVerticalBarrier() {
    return new BarrierObject({
        x: 1940,
        y: 170,
        width: 110,
        height: 300,
        imagePath:
            ASSET_CONFIG.levelObjects
                .barriers.verticalRock,
        collisionInset: {
            left: 16,
            right: 16,
            top: 14,
            bottom: 14
        }
    });
}

function createLevelTwoBackgrounds() {
    return [
        createLevelTwoFarLayer(),
        createLevelTwoBackLayer(),
        createLevelTwoMiddleLayer(),
        createLevelTwoFrontLayer(),
        createLevelTwoFloorLayer()
    ];
}

function createLevelTwoFarLayer() {
    return createLevelTwoLayer(
        'far',
        0,
        GAME_CONFIG.levelHeight,
        '#031c30',
        0.15,
        1
    );
}

function createLevelTwoBackLayer() {
    return createLevelTwoLayer(
        'back',
        0,
        GAME_CONFIG.levelHeight,
        '#04283d',
        0.3,
        1
    );
}

function createLevelTwoMiddleLayer() {
    return createLevelTwoLayer(
        'middle',
        0,
        GAME_CONFIG.levelHeight,
        'rgba(8, 89, 126, 0.44)',
        0.55,
        1
    );
}

function createLevelTwoFrontLayer() {
    return createLevelTwoLayer(
        'front',
        0,
        GAME_CONFIG.levelHeight,
        'rgba(5, 58, 86, 0.28)',
        0.85,
        1
    );
}

function createLevelTwoFloorLayer() {
    return createLevelTwoLayer(
        'floor',
        0,
        GAME_CONFIG.levelHeight,
        'rgba(1, 25, 39, 0.78)',
        1,
        1
    );
}

function createLevelTwoLayer(
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
        GAME_CONFIG.levelTwoWidth,
        height,
        {
            imagePath:
                ASSET_CONFIG.backgrounds
                    .levelTwo[layerName],
            fallbackColor,
            scrollFactor,
            opacity
        }
    );
}

function createLevelTwoSolidAreas() {
    return [
        {
            x: 0,
            y:
                GAME_CONFIG.levelHeight -
                130,
            width:
                GAME_CONFIG.levelTwoWidth,
            height: 130
        }
    ];
}

function createLevelTwoEnemies() {
    return [
        createLevelTwoEnemy(
            620,
            250,
            'vertical',
            'jellyFish'
        ),
        createLevelTwoEnemy(
            1160,
            310,
            'horizontal',
            'pufferFish'
        ),
        createLevelTwoEnemy(
            1740,
            220,
            'vertical',
            'jellyFish'
        ),
        createLevelTwoEnemy(
            2180,
            360,
            'horizontal',
            'pufferFish'
        )
    ];
}

function createLevelTwoEnemy(
    x,
    y,
    axis,
    type
) {
    const size =
        getLevelTwoEnemySize(type);

    return new Enemy({
        x,
        y,
        axis,
        type,
        width: size.width,
        height: size.height,
        range:
            GAME_CONFIG.enemyPatrolRange +
            40,
        speed:
            GAME_CONFIG.enemySpeed +
            0.25
    });
}

function getLevelTwoEnemySize(type) {
    if (type === 'jellyFish') {
        return {
            width: 58,
            height: 84
        };
    }

    return {
        width:
            GAME_CONFIG.enemyWidth + 4,
        height:
            GAME_CONFIG.enemyHeight + 4
    };
}

function createLevelTwoCollectibles() {
    return [
        createLevelTwoCoin(420, 230),
        createLevelTwoCoin(820, 320),
        createLevelTwoCoin(1340, 260),
        createLevelTwoCoin(1880, 210),
        createLevelTwoCoin(2380, 340),
        createLevelTwoPoisonBottle(
            1040,
            220
        ),
        createLevelTwoPoisonBottle(
            2040,
            280
        ),
        createLevelTwoPoisonBottle(
            2520,
            250
        )
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
        imagePath:
            ASSET_CONFIG.collectibles.coin,
        animationImages:
            ASSET_CONFIG.collectibles
                .coinAnimation,
        fallbackColor:
            GAME_CONFIG.coinFallbackColor
    });
}

function createLevelTwoPoisonBottle(x, y) {
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

function createLevelTwoEndboss() {
    return new Endboss({
        x:
            GAME_CONFIG.levelTwoWidth -
            500,
        y: 230,
        axis: 'vertical',
        range:
            GAME_CONFIG
                .endbossPatrolRange +
            70,
        speed:
            GAME_CONFIG.endbossSpeed +
            0.35
    });
}

function createLevelTwoFinishObject() {
    return new FinishObject(
        GAME_CONFIG.levelTwoWidth - 120,
        GAME_CONFIG.levelHeight - 300
    );
}