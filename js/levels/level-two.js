'use strict';

LEVELS[2] = createLevelTwo();

function createLevelTwo() {
    return new Level({
        number: 2,
        width: GAME_CONFIG.levelTwoWidth,
        height: GAME_CONFIG.levelHeight,
        backgroundObjects: createLevelTwoBackgrounds(),
        solidAreas: createLevelTwoSolidAreas(),
        enemies: createLevelTwoEnemies()
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
    return new BackgroundObject(
        0,
        0,
        GAME_CONFIG.levelTwoWidth,
        GAME_CONFIG.levelHeight,
        ASSET_CONFIG.backgrounds.levelTwo.back,
        '#04283d',
        0.25
    );
}

function createLevelTwoMiddleBackground() {
    return new BackgroundObject(
        0,
        0,
        GAME_CONFIG.levelTwoWidth,
        GAME_CONFIG.levelHeight,
        ASSET_CONFIG.backgrounds.levelTwo.middle,
        'rgba(8, 89, 126, 0.44)',
        0.55
    );
}

function createLevelTwoFrontBackground() {
    return new BackgroundObject(
        0,
        GAME_CONFIG.levelHeight - 130,
        GAME_CONFIG.levelTwoWidth,
        130,
        ASSET_CONFIG.backgrounds.levelTwo.front,
        'rgba(1, 25, 39, 0.78)',
        1
    );
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
        createEnemy(620, 250, 'vertical'),
        createEnemy(1160, 310, 'horizontal'),
        createEnemy(1740, 220, 'vertical'),
        createEnemy(2260, 360, 'horizontal')
    ];
}

function createEnemy(x, y, axis) {
    return new Enemy({
        x,
        y,
        axis,
        range: GAME_CONFIG.enemyPatrolRange + 40,
        speed: GAME_CONFIG.enemySpeed + 0.25
    });
}