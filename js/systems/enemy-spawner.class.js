'use strict';

/** Manages randomized enemy spawning, spacing, cleanup, and attempt budgets. */
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
        this.maximumPlacementAttempts = 120;
        this.reset();
    }

    /** Clears the attempt and schedules a new initial population. */
    reset() {
        this.level.enemies = [];
        this.spawnedCount = 0;
        this.nextSpawnTime = 0;
        this.hasCreatedInitialPopulation = false;
    }

    /**
     * @param {Character|null} player - Current player character.
     * @param {Object|null} visibleBounds - Camera-visible world area.
     * @param {number} [currentTime=GAME_CLOCK.now()] - Current game time.
     */
    update(player, visibleBounds, currentTime = GAME_CLOCK.now()) {
        if (!player || !visibleBounds) {
            return;
        }

        this.removeExpiredEnemies(visibleBounds);

        if (!this.hasCreatedInitialPopulation) {
            this.createInitialPopulation(player, visibleBounds, currentTime);
        }

        if (this.canSpawnEnemy(player, currentTime)) {
            this.spawnEnemy(player, visibleBounds);
            this.scheduleNextSpawn(currentTime);
        }
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @param {number} currentTime - Current game time.
     */
    createInitialPopulation(player, visibleBounds, currentTime) {
        while (this.level.enemies.length < this.config.initialCount &&
            this.hasRemainingBudget()) {
            if (!this.spawnEnemy(player, visibleBounds)) {
                break;
            }
        }

        this.hasCreatedInitialPopulation = true;
        this.scheduleNextSpawn(currentTime);
    }

    /**
     * @param {Character} player - Current player character.
     * @param {number} currentTime - Current game time.
     * @returns {boolean} Whether one timed enemy may be created.
     */
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

    /**
     * @param {Character} player - Current player character.
     * @returns {boolean} Whether spawning should pause.
     */
    shouldPauseSpawning(player) {
        if (!this.config.pauseDuringBoss) {
            return false;
        }

        return this.isPlayerInsideBossZone(player) ||
            this.level.endboss?.isIntroducing ||
            this.level.hasActiveEndboss();
    }

    /**
     * @param {Character} player - Current player character.
     * @returns {boolean} Whether the player entered the boss zone.
     */
    isPlayerInsideBossZone(player) {
        const bossZoneStart = this.level.width - this.config.bossZoneBuffer;
        return player.x + player.width >= bossZoneStart;
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @returns {boolean} Whether an enemy was spawned.
     */
    spawnEnemy(player, visibleBounds) {
        for (const type of this.createSpawnTypeOrder()) {
            const typeConfig = this.level.config.enemyTypes[type];
            const position = this.findSpawnPosition(
                typeConfig,
                player,
                visibleBounds
            );

            if (position) {
                this.addEnemy(type, position);
                return true;
            }
        }

        return false;
    }

    /**
     * @param {string} type - Configured enemy type.
     * @param {Object} position - Safe world spawn position.
     */
    addEnemy(type, position) {
        this.level.enemies.push(this.factory.create(
            type,
            position.x,
            position.y
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
                types[randomIndex],
                types[index]
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

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {Character} player - Current player character.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @returns {Object|null} Safe spawn position or null.
     */
    findSpawnPosition(typeConfig, player, visibleBounds) {
        const horizontalRange = this.getHorizontalSpawnRange(
            visibleBounds,
            typeConfig
        );
        if (!horizontalRange) {
            return null;
        }
        return this.findPositionInRange(
            typeConfig,
            player,
            visibleBounds,
            horizontalRange
        );
    }

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {Character} player - Current player character.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @param {Object} horizontalRange - Horizontal spawn range.
     * @returns {Object|null} Safe randomized or fallback position.
     */
    findPositionInRange(
        typeConfig,
        player,
        visibleBounds,
        horizontalRange
    ) {
        const position = this.findRandomSpawnPosition(
            typeConfig,
            player,
            visibleBounds,
            horizontalRange
        );
        if (position) {
            return position;
        }
        return this.findFallbackSpawnPosition(
            typeConfig,
            player,
            visibleBounds,
            horizontalRange
        );
    }

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {Character} player - Current player character.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @param {Object} horizontalRange - Horizontal spawn range.
     * @returns {Object|null} Random safe position or null.
     */
    findRandomSpawnPosition(
        typeConfig,
        player,
        visibleBounds,
        horizontalRange
    ) {
        for (let attempt = 0;
            attempt < this.maximumPlacementAttempts;
            attempt++) {
            const candidate = this.createCandidate(
                typeConfig,
                horizontalRange,
                visibleBounds
            );
            if (this.isValidSpawnPosition(candidate, player)) {
                return { x: candidate.x, y: candidate.y };
            }
        }
        return null;
    }

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {Character} player - Current player character.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @param {Object} horizontalRange - Horizontal spawn range.
     * @returns {Object|null} Valid fallback position or null.
     */
    findFallbackSpawnPosition(
        typeConfig,
        player,
        visibleBounds,
        horizontalRange
    ) {
        const verticalRange = this.getVerticalSpawnRange(
            typeConfig,
            visibleBounds
        );
        const step = Math.max(40, this.config.minimumEnemyDistance / 2);
        const xValues = this.createSearchValues(horizontalRange, step);
        const yValues = this.createSearchValues(verticalRange, step);
        this.rotateSearchValues(xValues);
        this.rotateSearchValues(yValues);
        return this.findValidGridCandidate(
            typeConfig,
            player,
            xValues,
            yValues
        );
    }

    /**
     * @param {Object} range - Numeric minimum and maximum range.
     * @param {number} step - Distance between search values.
     * @returns {number[]} Values including the upper limit.
     */
    createSearchValues(range, step) {
        const values = [];

        for (let value = range.minimum;
            value <= range.maximum;
            value += step) {
            values.push(value);
        }

        if (values[values.length - 1] !== range.maximum) {
            values.push(range.maximum);
        }

        return values;
    }

    /** @param {number[]} values - Search values to rotate in place. */
    rotateSearchValues(values) {
        const startIndex = this.random.integer(0, values.length - 1);
        values.push(...values.splice(0, startIndex));
    }

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {Character} player - Current player character.
     * @param {number[]} xValues - Horizontal search positions.
     * @param {number[]} yValues - Vertical search positions.
     * @returns {Object|null} First valid grid position or null.
     */
    findValidGridCandidate(typeConfig, player, xValues, yValues) {
        for (const x of xValues) {
            for (const y of yValues) {
                const candidate = this.createGridCandidate(
                    typeConfig,
                    x,
                    y
                );

                if (this.isValidSpawnPosition(candidate, player)) {
                    return { x, y };
                }
            }
        }

        return null;
    }

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {number} x - Horizontal candidate position.
     * @param {number} y - Vertical candidate position.
     * @returns {Object} Rectangular spawn candidate.
     */
    createGridCandidate(typeConfig, x, y) {
        return {
            x,
            y,
            width: typeConfig.width,
            height: typeConfig.height
        };
    }

    /**
     * @param {Object} visibleBounds - Camera-visible world area.
     * @param {Object} typeConfig - Enemy type configuration.
     * @returns {Object|null} Horizontal spawn range or null.
     */
    getHorizontalSpawnRange(visibleBounds, typeConfig) {
        const minimum = visibleBounds.right + this.config.viewportOffset;
        const maximum = this.level.width -
            this.config.bossZoneBuffer -
            typeConfig.width;

        if (minimum >= maximum) {
            return null;
        }

        return { minimum, maximum };
    }

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {Object} horizontalRange - Horizontal spawn range.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @returns {Object} Randomized rectangular spawn candidate.
     */
    createCandidate(typeConfig, horizontalRange, visibleBounds) {
        const verticalRange = this.getVerticalSpawnRange(
            typeConfig,
            visibleBounds
        );
        return {
            x: this.random.between(
                horizontalRange.minimum,
                horizontalRange.maximum
            ),
            y: this.random.between(
                verticalRange.minimum,
                verticalRange.maximum
            ),
            width: typeConfig.width,
            height: typeConfig.height
        };
    }

    /**
     * @param {Object} typeConfig - Enemy type configuration.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @returns {Object} Valid vertical spawn range.
     */
    getVerticalSpawnRange(typeConfig, visibleBounds) {
        const floorY = this.level.height -
            this.level.config.world.floorHeight;
        const margin = this.getMovementVerticalMargin(typeConfig.movement);
        const minimum = Math.max(
            20 + margin,
            visibleBounds.top + 20 + margin
        );
        const maximumByCamera = visibleBounds.bottom -
            typeConfig.height - 20 - margin;
        const maximumByFloor = floorY -
            typeConfig.height - 20 - margin;
        return {
            minimum,
            maximum: Math.max(
                minimum,
                Math.min(maximumByCamera, maximumByFloor)
            )
        };
    }

    /**
     * @param {Object} movement - Enemy movement configuration.
     * @returns {number} Required vertical movement margin.
     */
    getMovementVerticalMargin(movement) {
        if (movement.profile === 'waveLeft') {
            return movement.waveAmplitude;
        }
        return movement.verticalRange / 2;
    }

    /**
     * @param {Object} candidate - Rectangular spawn candidate.
     * @param {Character} player - Current player character.
     * @returns {boolean} Whether every safety rule is satisfied.
     */
    isValidSpawnPosition(candidate, player) {
        return this.isInsidePlayableArea(candidate) &&
            this.hasSafePlayerDistance(candidate, player) &&
            !this.overlapsAny(candidate, this.level.solidAreas) &&
            !this.overlapsAny(candidate, this.getOccupiedEnemyAreas()) &&
            !this.overlapsAny(candidate, this.getCollectibleAreas()) &&
            !this.overlapsObject(candidate, this.level.finishObject) &&
            !this.overlapsObject(candidate, this.level.endboss);
    }

    /**
     * @param {Object} candidate - Rectangular spawn candidate.
     * @returns {boolean} Whether it is inside the playable world.
     */
    isInsidePlayableArea(candidate) {
        const floorY = this.level.height -
            this.level.config.world.floorHeight;
        return candidate.x >= 0 &&
            candidate.x + candidate.width <= this.level.width &&
            candidate.y >= 0 &&
            candidate.y + candidate.height <= floorY;
    }

    /**
     * @param {Object} candidate - Rectangular spawn candidate.
     * @param {Character} player - Current player character.
     * @returns {boolean} Whether it is far enough from the player.
     */
    hasSafePlayerDistance(candidate, player) {
        const candidateX = candidate.x + candidate.width / 2;
        const candidateY = candidate.y + candidate.height / 2;
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;
        return Math.hypot(
            candidateX - playerX,
            candidateY - playerY
        ) >= this.config.minimumPlayerDistance;
    }

    /** @returns {Object[]} Enemy areas enlarged by required spacing. */
    getOccupiedEnemyAreas() {
        const spacing = this.config.minimumEnemyDistance;
        return this.level.enemies.map((enemy) => ({
            x: enemy.x - spacing,
            y: enemy.y - spacing,
            width: enemy.width + spacing * 2,
            height: enemy.height + spacing * 2
        }));
    }

    /** @returns {CollectibleObject[]} Active collectible hitboxes. */
    getCollectibleAreas() {
        return this.level.collectibles.filter((collectible) => {
            return !collectible.isCollected;
        });
    }

    /**
     * @param {Object} candidate - Rectangular spawn candidate.
     * @param {Object[]} areas - Areas to test against.
     * @returns {boolean} Whether it overlaps any area.
     */
    overlapsAny(candidate, areas) {
        return areas.some((area) => {
            return this.overlapsObject(candidate, area);
        });
    }

    /**
     * @param {Object} candidate - Rectangular spawn candidate.
     * @param {Object|null} object - Object to test against.
     * @returns {boolean} Whether both objects overlap.
     */
    overlapsObject(candidate, object) {
        if (!object) {
            return false;
        }

        return candidate.x < object.x + object.width &&
            candidate.x + candidate.width > object.x &&
            candidate.y < object.y + object.height &&
            candidate.y + candidate.height > object.y;
    }

    /** @param {Object} visibleBounds - Camera-visible world area. */
    removeExpiredEnemies(visibleBounds) {
        this.level.enemies = this.level.enemies.filter((enemy) => {
            return !this.hasCompletedDeath(enemy) &&
                !this.hasEscapedLeft(enemy, visibleBounds);
        });
    }

    /**
     * @param {Enemy} enemy - Enemy to inspect.
     * @returns {boolean} Whether its death animation completed.
     */
    hasCompletedDeath(enemy) {
        return enemy.isDefeated && enemy.isAnimationFinished();
    }

    /**
     * @param {Enemy} enemy - Enemy to inspect.
     * @param {Object} visibleBounds - Camera-visible world area.
     * @returns {boolean} Whether it escaped past the camera edge.
     */
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