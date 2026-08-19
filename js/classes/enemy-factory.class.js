'use strict';

class EnemyFactory {
    /** Creates enemies from one validated level configuration. */
    constructor(levelConfig) {
        this.levelConfig = levelConfig;
    }

    /** Creates one configured enemy at the requested position. */
    create(type, x, y) {
        const config = this.getTypeConfig(type);
        return new Enemy({
            x,
            y,
            type,
            axis: this.getMovementAxis(config.movementProfile),
            width: config.width,
            height: config.height,
            range: config.patrolRange,
            speed: config.speed,
            damage: config.damage,
            health: config.health,
            movementProfile: config.movementProfile
        });
    }

    /** Returns one enemy type configuration or throws clearly. */
    getTypeConfig(type) {
        const config = this.levelConfig.enemyTypes[type];

        if (!config) {
            throw new Error(`[EnemyFactory] Unknown enemy type: ${type}`);
        }

        return config;
    }

    /** Maps future movement profiles to the current patrol axis. */
    getMovementAxis(movementProfile) {
        return movementProfile === 'verticalDrift' ?
            'vertical' : 'horizontal';
    }
}