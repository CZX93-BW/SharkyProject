'use strict';

class EnemyFactory {
    /** Creates enemies from one validated level configuration. */
    constructor(levelConfig, randomGenerator = null) {
        this.levelConfig = levelConfig;
        this.random = randomGenerator || new RandomGenerator();
    }

    /** Creates one configured enemy at the requested position. */
    create(type, x, y) {
        const config = this.getTypeConfig(type);
        return new Enemy({
            x,
            y,
            type,
            width: config.width,
            height: config.height,
            damage: config.damage,
            health: config.health,
            movement: this.createMovementConfig(config.movement)
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

    /** Adds world boundaries and randomized movement state. */
    createMovementConfig(movementConfig) {
        return {
            ...movementConfig,
            worldTop: 20,
            worldBottom: this.levelConfig.world.height -
                this.levelConfig.world.floorHeight,
            initialPhase: this.random.between(0, Math.PI * 2),
            initialVerticalDirection: this.random.next() < 0.5 ? -1 : 1
        };
    }
}