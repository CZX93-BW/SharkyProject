'use strict';

class EnemyFactory {
    constructor(levelConfig, randomGenerator = null) {
        this.levelConfig = levelConfig;
        this.random = randomGenerator || new RandomGenerator();
    }

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

    getTypeConfig(type) {
        const config = this.levelConfig.enemyTypes[type];

        if (!config) {
            throw new Error(`[EnemyFactory] Unknown enemy type: ${type}`);
        }

        return config;
    }

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