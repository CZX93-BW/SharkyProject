'use strict';

class EnemySpawner {
    /** Creates a level-bound enemy lifecycle controller. */
    constructor(level, factory = null, randomGenerator = null) {
        this.level = level;
        this.config = level.config.spawner;
        this.random = randomGenerator || new RandomGenerator();
        this.factory = factory || new EnemyFactory(level.config);
        this.maximumPlacementAttempts = 30;
        this.reset();
    }

    /** Clears the attempt and schedules a new initial population. */
    reset() {
        this.level.enemies = [];
        this.spawnedCount = 0;
        this.nextSpawnTime = 0;
        this.hasCreatedInitialPopulation = false;
    }

    /** Updates cleanup, initial population and timed respawning. */
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

    /** Creates the configured number of randomized starting enemies. */
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

    /** Returns whether one timed enemy may be created. */
    canSpawnEnemy(player, currentTime) {
        return !this.shouldPauseSpawning(player) &&
            this.level.enemies.length < this.config.maxActiveEnemies &&
            this.hasRemainingBudget() &&
            currentTime >= this.nextSpawnTime;
    }

    /** Returns whether the attempt still has unused enemy budget. */
    hasRemainingBudget() {
        return this.spawnedCount < this.config.totalEnemyBudget;
    }

    /** Stops normal spawning near or during the boss encounter. */
    shouldPauseSpawning(player) {
        if (!this.config.pauseDuringBoss) {
            return false;
        }

        return this.isPlayerInsideBossZone(player) ||
            this.level.endboss?.isIntroducing ||
            this.level.hasActiveEndboss();
    }

    /** Returns whether Sharky entered the configured boss zone. */
    isPlayerInsideBossZone(player) {
        const bossZoneStart = this.level.width - this.config.bossZoneBuffer;
        return player.x + player.width >= bossZoneStart;
    }

    /** Creates one weighted enemy at a safe randomized position. */
    spawnEnemy(player, visibleBounds) {
        const type = this.selectEnemyType();
        const typeConfig = this.level.config.enemyTypes[type];
        const position = this.findSpawnPosition(
            typeConfig,
            player,
            visibleBounds
        );

        if (!position) {
            return false;
        }

        this.level.enemies.push(
            this.factory.create(type, position.x, position.y)
        );
        this.spawnedCount += 1;
        return true;
    }

    /** Selects one configured type using normalized level weights. */
    selectEnemyType() {
        const entries = Object.entries(this.level.config.enemyTypes);
        const selected = this.random.pickWeighted(entries, ([, config]) => {
            return config.weight;
        });
        return selected[0];
    }

    /** Searches a limited number of safe randomized positions. */
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

        return null;
    }

    /** Returns the off-camera horizontal area before the boss zone. */
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

    /** Creates one randomized hitbox candidate. */
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

    /** Returns a visible-height range above the configured floor. */
    getVerticalSpawnRange(typeConfig, visibleBounds) {
        const floorY = this.level.height - this.level.config.world.floorHeight;
        const minimum = Math.max(20, visibleBounds.top + 20);
        const maximumByCamera = visibleBounds.bottom - typeConfig.height - 20;
        const maximumByFloor = floorY - typeConfig.height - 20;
        return {
            minimum,
            maximum: Math.max(minimum, Math.min(maximumByCamera, maximumByFloor))
        };
    }

    /** Applies player, object, barrier and world safety rules. */
    isValidSpawnPosition(candidate, player) {
        return this.isInsidePlayableArea(candidate) &&
            this.hasSafePlayerDistance(candidate, player) &&
            !this.overlapsAny(candidate, this.level.solidAreas) &&
            !this.overlapsAny(candidate, this.getOccupiedEnemyAreas()) &&
            !this.overlapsAny(candidate, this.getCollectibleAreas()) &&
            !this.overlapsObject(candidate, this.level.finishObject) &&
            !this.overlapsObject(candidate, this.level.endboss);
    }

    /** Returns whether the full candidate is inside the playable world. */
    isInsidePlayableArea(candidate) {
        const floorY = this.level.height - this.level.config.world.floorHeight;
        return candidate.x >= 0 &&
            candidate.x + candidate.width <= this.level.width &&
            candidate.y >= 0 &&
            candidate.y + candidate.height <= floorY;
    }

    /** Enforces the configured minimum distance to Sharky. */
    hasSafePlayerDistance(candidate, player) {
        const candidateX = candidate.x + candidate.width / 2;
        const candidateY = candidate.y + candidate.height / 2;
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;
        return Math.hypot(candidateX - playerX, candidateY - playerY) >=
            this.config.minimumPlayerDistance;
    }

    /** Returns enemy hitboxes enlarged by the configured spacing. */
    getOccupiedEnemyAreas() {
        const spacing = this.config.minimumEnemyDistance;
        return this.level.enemies.map((enemy) => ({
            x: enemy.x - spacing,
            y: enemy.y - spacing,
            width: enemy.width + spacing * 2,
            height: enemy.height + spacing * 2
        }));
    }

    /** Returns active collectible hitboxes. */
    getCollectibleAreas() {
        return this.level.collectibles.filter((collectible) => {
            return !collectible.isCollected;
        });
    }

    /** Returns whether one hitbox overlaps any supplied area. */
    overlapsAny(candidate, areas) {
        return areas.some((area) => this.overlapsObject(candidate, area));
    }

    /** Returns whether two rectangle-like objects overlap. */
    overlapsObject(candidate, object) {
        if (!object) {
            return false;
        }

        return candidate.x < object.x + object.width &&
            candidate.x + candidate.width > object.x &&
            candidate.y < object.y + object.height &&
            candidate.y + candidate.height > object.y;
    }

    /** Removes completed death animations and escaped enemies. */
    removeExpiredEnemies(visibleBounds) {
        this.level.enemies = this.level.enemies.filter((enemy) => {
            return !this.hasCompletedDeath(enemy) &&
                !this.hasEscapedLeft(enemy, visibleBounds);
        });
    }

    /** Returns whether the complete death animation has ended. */
    hasCompletedDeath(enemy) {
        return enemy.isDefeated && enemy.isAnimationFinished();
    }

    /** Returns whether an enemy passed the buffered camera edge. */
    hasEscapedLeft(enemy, visibleBounds) {
        return enemy.x + enemy.width <
            visibleBounds.left - this.config.despawnBuffer;
    }

    /** Schedules the next randomized respawn time. */
    scheduleNextSpawn(currentTime) {
        const interval = this.random.between(
            this.config.spawnInterval.min,
            this.config.spawnInterval.max
        );
        this.nextSpawnTime = currentTime + interval;
    }

    /** Exposes stable debug values without leaking mutable config. */
    getStats() {
        return {
            active: this.level.enemies.length,
            spawned: this.spawnedCount,
            maximumActive: this.config.maxActiveEnemies,
            totalBudget: this.config.totalEnemyBudget
        };
    }
}