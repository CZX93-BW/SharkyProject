'use strict';

/** Creates configured enemy instances with randomized movement state. */
class EnemyFactory {
    /**
     * @param {Object} levelConfig - Validated active-level configuration.
     * @param {RandomGenerator|null} [randomGenerator=null] - Random source.
     */
    constructor(levelConfig, randomGenerator = null) {
        this.levelConfig = levelConfig;
        this.random = randomGenerator || new RandomGenerator();
    }

    /**
     * @param {string} type - Configured enemy type.
     * @param {number} x - Horizontal spawn position.
     * @param {number} y - Vertical spawn position.
     * @returns {Enemy} Configured enemy instance.
     */
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

    /**
     * @param {string} type - Configured enemy type.
     * @returns {Object} Matching enemy type configuration.
     * @throws {Error} When the requested type is unknown.
     */
    getTypeConfig(type) {
        const config = this.levelConfig.enemyTypes[type];

        if (!config) {
            throw new Error(`[EnemyFactory] Unknown enemy type: ${type}`);
        }

        return config;
    }

    /**
     * @param {Object} movementConfig - Base movement configuration.
     * @returns {Object} Movement configuration with world and random state.
     */
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