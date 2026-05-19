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
        enemies: createLevelOneEnemies()
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
    return new BackgroundObject(
        0,
        0,
        GAME_CONFIG.levelOneWidth,
        GAME_CONFIG.levelHeight,
        ASSET_CONFIG.backgrounds.levelOne.back,
        '#06354f',
        0.25
    );
}

function createLevelOneMiddleBackground() {
    return new BackgroundObject(
        0,
        0,
        GAME_CONFIG.levelOneWidth,
        GAME_CONFIG.levelHeight,
        ASSET_CONFIG.backgrounds.levelOne.middle,
        'rgba(14, 118, 148, 0.42)',
        0.55
    );
}

function createLevelOneFrontBackground() {
    return new BackgroundObject(
        0,
        GAME_CONFIG.levelHeight - 120,
        GAME_CONFIG.levelOneWidth,
        120,
        ASSET_CONFIG.backgrounds.levelOne.front,
        'rgba(2, 34, 44, 0.75)',
        1
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
        createEnemy(520, 260, 'horizontal'),
        createEnemy(980, 340, 'vertical'),
        createEnemy(1480, 220, 'horizontal')
    ];
}

function createEnemy(x, y, axis) {
    return new Enemy({
        x,
        y,
        axis,
        range: GAME_CONFIG.enemyPatrolRange
    });
}