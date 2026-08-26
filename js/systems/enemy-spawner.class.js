'use strict';

/** Manages randomized enemy spawning, cleanup, timing, and attempt budgets. */
class EnemySpawner {
    /**
     * @param {Level} level - Level controlled by this spawner.
     * @param {EnemyFactory|null} [factory=null] - Enemy creation service.
     * @param {RandomGenerator|null} [randomGenerator=null] - Random source.
     */
    constructor(level, factory = null, randomGenerator = null) {
        this.level = level;
        this.config = level.config.spawner;
        this.random = randomGenerator || new RandomGenerator();
        this.factory = factory || new EnemyFactory(level.config, this.random);
        this.positionFinder = new EnemySpawnPositionFinder(
            level, this.random
        );
        this.reset();
    }

    /** Clears the attempt and schedules a new initial population. */
    reset() {
        this.level.enemies = [];
        this.spawnedCount = 0;
        this.nextSpawnTime = 0;
        this.hasCreatedInitialPopulation = false;
    }

    /** Updates cleanup, initial population, and timed spawning. */
    update(player, visibleBounds, currentTime = GAME_CLOCK.now()) {
        if (!player || !visibleBounds) {
            return;
        }
        this.removeExpiredEnemies(visibleBounds);
        this.createInitialPopulationIfNeeded(
            player, visibleBounds, currentTime
        );
        this.spawnTimedEnemyIfPossible(player, visibleBounds, currentTime);
    }

    /** Creates the initial population once per attempt. */
    createInitialPopulationIfNeeded(player, visibleBounds, currentTime) {
        if (!this.hasCreatedInitialPopulation) {
            this.createInitialPopulation(player, visibleBounds, currentTime);
        }
    }

    /** Creates one scheduled enemy when every limit permits it. */
    spawnTimedEnemyIfPossible(player, visibleBounds, currentTime) {
        if (!this.canSpawnEnemy(player, currentTime)) {
            return;
        }
        this.spawnEnemy(player, visibleBounds);
        this.scheduleNextSpawn(currentTime);
    }

    /** Creates the configured initial enemy population. */
    createInitialPopulation(player, visibleBounds, currentTime) {
        while (this.shouldCreateInitialEnemy()) {
            if (!this.spawnEnemy(player, visibleBounds)) {
                break;
            }
        }
        this.hasCreatedInitialPopulation = true;
        this.scheduleNextSpawn(currentTime);
    }

    /** @returns {boolean} Whether another initial enemy is required. */
    shouldCreateInitialEnemy() {
        return this.level.enemies.length < this.config.initialCount &&
            this.hasRemainingBudget();
    }

    /** @returns {boolean} Whether one timed enemy may be created. */
    canSpawnEnemy(player, currentTime) {
        return !this.shouldPauseSpawning(player) &&
            this.level.enemies.length < this.config.maxActiveEnemies &&
            this.hasRemainingBudget() &&
            currentTime >= this.nextSpawnTime;
    }

    /** @returns {boolean} Whether the attempt has unused enemy budget. */
    hasRemainingBudget() {
        return this.spawnedCount < this.config.totalEnemyBudget;
    }

    /** @returns {boolean} Whether spawning should pause. */
    shouldPauseSpawning(player) {
        if (!this.config.pauseDuringBoss) {
            return false;
        }
        return this.isPlayerInsideBossZone(player) ||
            this.level.endboss?.isIntroducing ||
            this.level.hasActiveEndboss();
    }

    /** @returns {boolean} Whether the player entered the boss zone. */
    isPlayerInsideBossZone(player) {
        const bossZoneStart = this.level.width - this.config.bossZoneBuffer;
        return player.x + player.width >= bossZoneStart;
    }

    /** @returns {boolean} Whether an enemy was spawned. */
    spawnEnemy(player, visibleBounds) {
        for (const type of this.createSpawnTypeOrder()) {
            const typeConfig = this.level.config.enemyTypes[type];
            const position = this.positionFinder.find(
                typeConfig, player, visibleBounds
            );
            if (position) {
                this.addEnemy(type, position);
                return true;
            }
        }
        return false;
    }

    /** Adds one enemy at a validated world position. */
    addEnemy(type, position) {
        this.level.enemies.push(this.factory.create(
            type, position.x, position.y
        ));
        this.spawnedCount += 1;
    }

    /** @returns {string[]} Preferred enemy type followed by fallbacks. */
    createSpawnTypeOrder() {
        const preferredType = this.selectEnemyType();
        const fallbackTypes = Object.keys(this.level.config.enemyTypes)
            .filter((type) => type !== preferredType);
        this.shuffleTypes(fallbackTypes);
        return [preferredType, ...fallbackTypes];
    }

    /** @param {string[]} types - Enemy types to shuffle in place. */
    shuffleTypes(types) {
        for (let index = types.length - 1; index > 0; index--) {
            const randomIndex = this.random.integer(0, index);
            [types[index], types[randomIndex]] = [
                types[randomIndex], types[index]
            ];
        }
    }

    /** @returns {string} Enemy type selected from configured weights. */
    selectEnemyType() {
        const entries = Object.entries(this.level.config.enemyTypes);
        const selected = this.random.pickWeighted(entries, ([, config]) => {
            return config.weight;
        });
        return selected[0];
    }

    /** @param {Object} visibleBounds - Camera-visible world area. */
    removeExpiredEnemies(visibleBounds) {
        this.level.enemies = this.level.enemies.filter((enemy) => {
            return !this.hasCompletedDeath(enemy) &&
                !this.hasEscapedLeft(enemy, visibleBounds);
        });
    }

    /** @returns {boolean} Whether the enemy death animation completed. */
    hasCompletedDeath(enemy) {
        return enemy.isDefeated && enemy.isAnimationFinished();
    }

    /** @returns {boolean} Whether the enemy escaped past the camera edge. */
    hasEscapedLeft(enemy, visibleBounds) {
        return enemy.x + enemy.width <
            visibleBounds.left - this.config.despawnBuffer;
    }

    /** @param {number} currentTime - Current game time. */
    scheduleNextSpawn(currentTime) {
        const interval = this.random.between(
            this.config.spawnInterval.min,
            this.config.spawnInterval.max
        );
        this.nextSpawnTime = currentTime + interval;
    }

    /** @returns {Object} Stable debug counters for the spawner. */
    getStats() {
        return {
            active: this.level.enemies.length,
            spawned: this.spawnedCount,
            maximumActive: this.config.maxActiveEnemies,
            totalBudget: this.config.totalEnemyBudget
        };
    }
}