'use strict';

class EnemySpawner {
    constructor(level, factory = null, randomGenerator = null) {
        this.level = level;
        this.config = level.config.spawner;
        this.random = randomGenerator || new RandomGenerator();
        this.factory = factory || new EnemyFactory(level.config, this.random);
        this.maximumPlacementAttempts = 120;
        this.reset();
    }

    reset() {
        this.level.enemies = [];
        this.spawnedCount = 0;
        this.nextSpawnTime = 0;
        this.hasCreatedInitialPopulation = false;
    }

    update(player, visibleBounds, currentTime = Date.now()) {
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

    canSpawnEnemy(player, currentTime) {
        return !this.shouldPauseSpawning(player) &&
            this.level.enemies.length < this.config.maxActiveEnemies &&
            this.hasRemainingBudget() &&
            currentTime >= this.nextSpawnTime;
    }

    hasRemainingBudget() {
        return this.spawnedCount < this.config.totalEnemyBudget;
    }

    shouldPauseSpawning(player) {
        if (!this.config.pauseDuringBoss) {
            return false;
        }

        return this.isPlayerInsideBossZone(player) ||
            this.level.endboss?.isIntroducing ||
            this.level.hasActiveEndboss();
    }

    isPlayerInsideBossZone(player) {
        const bossZoneStart = this.level.width - this.config.bossZoneBuffer;
        return player.x + player.width >= bossZoneStart;
    }

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

    addEnemy(type, position) {
        this.level.enemies.push(this.factory.create(
            type,
            position.x,
            position.y
        ));
        this.spawnedCount += 1;
    }

    createSpawnTypeOrder() {
        const preferredType = this.selectEnemyType();
        const fallbackTypes = Object.keys(this.level.config.enemyTypes)
            .filter((type) => type !== preferredType);
        this.shuffleTypes(fallbackTypes);
        return [preferredType, ...fallbackTypes];
    }

    shuffleTypes(types) {
        for (let index = types.length - 1; index > 0; index--) {
            const randomIndex = this.random.integer(0, index);
            [types[index], types[randomIndex]] = [
                types[randomIndex],
                types[index]
            ];
        }
    }

    selectEnemyType() {
        const entries = Object.entries(this.level.config.enemyTypes);
        const selected = this.random.pickWeighted(entries, ([, config]) => {
            return config.weight;
        });
        return selected[0];
    }

    findSpawnPosition(typeConfig, player, visibleBounds) {
        const horizontalRange = this.getHorizontalSpawnRange(
            visibleBounds,
            typeConfig
        );

        if (!horizontalRange) {
            return null;
        }

        for (let attempt = 0; attempt < this.maximumPlacementAttempts; attempt++) {
            const candidate = this.createCandidate(
                typeConfig,
                horizontalRange,
                visibleBounds
            );

            if (this.isValidSpawnPosition(candidate, player)) {
                return { x: candidate.x, y: candidate.y };
            }
        }

        return this.findFallbackSpawnPosition(
            typeConfig,
            player,
            visibleBounds,
            horizontalRange
        );
    }

    findFallbackSpawnPosition(typeConfig, player, visibleBounds, horizontalRange) {
        const verticalRange = this.getVerticalSpawnRange(typeConfig, visibleBounds);
        const step = Math.max(40, this.config.minimumEnemyDistance / 2);
        const xValues = this.createSearchValues(horizontalRange, step);
        const yValues = this.createSearchValues(verticalRange, step);
        this.rotateSearchValues(xValues);
        this.rotateSearchValues(yValues);
        return this.findValidGridCandidate(typeConfig, player, xValues, yValues);
    }

    createSearchValues(range, step) {
        const values = [];

        for (let value = range.minimum; value <= range.maximum; value += step) {
            values.push(value);
        }

        if (values[values.length - 1] !== range.maximum) {
            values.push(range.maximum);
        }

        return values;
    }

    rotateSearchValues(values) {
        const startIndex = this.random.integer(0, values.length - 1);
        values.push(...values.splice(0, startIndex));
    }

    findValidGridCandidate(typeConfig, player, xValues, yValues) {
        for (const x of xValues) {
            for (const y of yValues) {
                const candidate = this.createGridCandidate(typeConfig, x, y);

                if (this.isValidSpawnPosition(candidate, player)) {
                    return { x, y };
                }
            }
        }

        return null;
    }

    createGridCandidate(typeConfig, x, y) {
        return {
            x,
            y,
            width: typeConfig.width,
            height: typeConfig.height
        };
    }

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

    createCandidate(typeConfig, horizontalRange, visibleBounds) {
        const verticalRange = this.getVerticalSpawnRange(
            typeConfig,
            visibleBounds
        );
        return {
            x: this.random.between(horizontalRange.minimum, horizontalRange.maximum),
            y: this.random.between(verticalRange.minimum, verticalRange.maximum),
            width: typeConfig.width,
            height: typeConfig.height
        };
    }

    getVerticalSpawnRange(typeConfig, visibleBounds) {
        const floorY = this.level.height - this.level.config.world.floorHeight;
        const margin = this.getMovementVerticalMargin(typeConfig.movement);
        const minimum = Math.max(
            20 + margin,
            visibleBounds.top + 20 + margin
        );
        const maximumByCamera = visibleBounds.bottom -
            typeConfig.height - 20 - margin;
        const maximumByFloor = floorY - typeConfig.height - 20 - margin;
        return {
            minimum,
            maximum: Math.max(minimum, Math.min(maximumByCamera, maximumByFloor))
        };
    }

    getMovementVerticalMargin(movement) {
        if (movement.profile === 'waveLeft') {
            return movement.waveAmplitude;
        }

        return movement.verticalRange / 2;
    }

    isValidSpawnPosition(candidate, player) {
        return this.isInsidePlayableArea(candidate) &&
            this.hasSafePlayerDistance(candidate, player) &&
            !this.overlapsAny(candidate, this.level.solidAreas) &&
            !this.overlapsAny(candidate, this.getOccupiedEnemyAreas()) &&
            !this.overlapsAny(candidate, this.getCollectibleAreas()) &&
            !this.overlapsObject(candidate, this.level.finishObject) &&
            !this.overlapsObject(candidate, this.level.endboss);
    }

    isInsidePlayableArea(candidate) {
        const floorY = this.level.height - this.level.config.world.floorHeight;
        return candidate.x >= 0 &&
            candidate.x + candidate.width <= this.level.width &&
            candidate.y >= 0 &&
            candidate.y + candidate.height <= floorY;
    }

    hasSafePlayerDistance(candidate, player) {
        const candidateX = candidate.x + candidate.width / 2;
        const candidateY = candidate.y + candidate.height / 2;
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;
        return Math.hypot(candidateX - playerX, candidateY - playerY) >=
            this.config.minimumPlayerDistance;
    }

    getOccupiedEnemyAreas() {
        const spacing = this.config.minimumEnemyDistance;
        return this.level.enemies.map((enemy) => ({
            x: enemy.x - spacing,
            y: enemy.y - spacing,
            width: enemy.width + spacing * 2,
            height: enemy.height + spacing * 2
        }));
    }

    getCollectibleAreas() {
        return this.level.collectibles.filter((collectible) => {
            return !collectible.isCollected;
        });
    }

    overlapsAny(candidate, areas) {
        return areas.some((area) => this.overlapsObject(candidate, area));
    }

    overlapsObject(candidate, object) {
        if (!object) {
            return false;
        }

        return candidate.x < object.x + object.width &&
            candidate.x + candidate.width > object.x &&
            candidate.y < object.y + object.height &&
            candidate.y + candidate.height > object.y;
    }

    removeExpiredEnemies(visibleBounds) {
        this.level.enemies = this.level.enemies.filter((enemy) => {
            return !this.hasCompletedDeath(enemy) &&
                !this.hasEscapedLeft(enemy, visibleBounds);
        });
    }

    hasCompletedDeath(enemy) {
        return enemy.isDefeated && enemy.isAnimationFinished();
    }

    hasEscapedLeft(enemy, visibleBounds) {
        return enemy.x + enemy.width <
            visibleBounds.left - this.config.despawnBuffer;
    }

    scheduleNextSpawn(currentTime) {
        const interval = this.random.between(
            this.config.spawnInterval.min,
            this.config.spawnInterval.max
        );
        this.nextSpawnTime = currentTime + interval;
    }

    getStats() {
        return {
            active: this.level.enemies.length,
            spawned: this.spawnedCount,
            maximumActive: this.config.maxActiveEnemies,
            totalBudget: this.config.totalEnemyBudget
        };
    }
}