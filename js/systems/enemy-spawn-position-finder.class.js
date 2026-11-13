'use strict';

/** Finds safe randomized or deterministic enemy spawn positions. */
class EnemySpawnPositionFinder {
    /**
     * @param {Level} level - Level receiving spawned enemies.
     * @param {RandomGenerator} randomGenerator - Random value source.
     */
    constructor(level, randomGenerator) {
        this.level = level;
        this.config = level.config.spawner;
        this.random = randomGenerator;
        this.maximumPlacementAttempts = 120;
    }

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Character} player - Current player.
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @returns {Object|null} Safe spawn position or null.
     */
    find(typeConfig, player, visibleBounds) {
        const horizontalRange = this.getHorizontalSpawnRange(
            visibleBounds, typeConfig
        );
        if (!horizontalRange) {
            return null;
        }
        return this.findPositionInRange(
            typeConfig, player, visibleBounds, horizontalRange
        );
    }

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Character} player - Current player.
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @param {Object} horizontalRange - Minimum and maximum spawn x coordinates.
     * @returns {Object|null} Safe randomized or fallback position.
     */
    findPositionInRange(typeConfig, player, visibleBounds, horizontalRange) {
        const position = this.findRandomSpawnPosition(
            typeConfig, player, visibleBounds, horizontalRange
        );
        return position || this.findFallbackSpawnPosition(
            typeConfig, player, visibleBounds, horizontalRange
        );
    }

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Character} player - Current player.
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @param {Object} range - Minimum and maximum coordinates to search.
     * @returns {Object|null} Random safe position or null.
     */
    findRandomSpawnPosition(typeConfig, player, visibleBounds, range) {
        for (let attempt = 0;
            attempt < this.maximumPlacementAttempts;
            attempt++) {
            const candidate = this.createCandidate(
                typeConfig, range, visibleBounds
            );
            if (this.isValidSpawnPosition(candidate, player)) {
                return { x: candidate.x, y: candidate.y };
            }
        }
        return null;
    }

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Character} player - Current player.
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @param {Object} range - Minimum and maximum coordinates to search.
     * @returns {Object|null} Valid fallback position or null.
     */
    findFallbackSpawnPosition(typeConfig, player, visibleBounds, range) {
        const verticalRange = this.getVerticalSpawnRange(
            typeConfig, visibleBounds
        );
        const step = Math.max(40, this.config.minimumEnemyDistance / 2);
        const xValues = this.createSearchValues(range, step);
        const yValues = this.createSearchValues(verticalRange, step);
        this.rotateSearchValues(xValues);
        this.rotateSearchValues(yValues);
        return this.findValidGridCandidate(
            typeConfig, player, xValues, yValues
        );
    }

    /**
     * @param {Object} range - Minimum and maximum coordinates to search.
     * @param {number} step - Distance between search positions.
     * @returns {number[]} Search values including the upper limit.
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
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Character} player - Current player.
     * @param {number[]} xValues - Candidate x coordinates.
     * @param {number[]} yValues - Candidate y coordinates.
     * @returns {Object|null} First valid grid position or null.
     */
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

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {number} x - Spawn x coordinate.
     * @param {number} y - Spawn y coordinate.
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
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @returns {Object|null} Horizontal spawn range or null.
     */
    getHorizontalSpawnRange(visibleBounds, typeConfig) {
        const minimum = visibleBounds.right + this.config.viewportOffset;
        const maximum = this.level.width -
            this.config.bossZoneBuffer - typeConfig.width;
        if (minimum >= maximum) {
            return null;
        }
        return { minimum, maximum };
    }

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Object} horizontalRange - Minimum and maximum spawn x coordinates.
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @returns {Object} Randomized rectangular spawn candidate.
     */
    createCandidate(typeConfig, horizontalRange, visibleBounds) {
        const verticalRange = this.getVerticalSpawnRange(
            typeConfig, visibleBounds
        );
        const x = this.random.between(
            horizontalRange.minimum, horizontalRange.maximum
        );
        const y = this.random.between(
            verticalRange.minimum, verticalRange.maximum
        );
        return this.createGridCandidate(typeConfig, x, y);
    }

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @returns {Object} Valid vertical spawn range.
     */
    getVerticalSpawnRange(typeConfig, visibleBounds) {
        const margin = this.getMovementVerticalMargin(typeConfig.movement);
        const minimum = this.getMinimumY(visibleBounds, margin);
        return {
            minimum,
            maximum: this.getMaximumY(
                typeConfig, visibleBounds, margin, minimum
            )
        };
    }

    /**
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @param {number} margin - Vertical clearance for enemy movement.
     * @returns {number} Minimum safe vertical spawn coordinate.
     */
    getMinimumY(visibleBounds, margin) {
        return Math.max(
            20 + margin,
            visibleBounds.top + 20 + margin
        );
    }

    /**
     * @param {Object} typeConfig - Size and movement settings for this enemy type.
     * @param {Object} visibleBounds - Visible camera bounds in world coordinates.
     * @param {number} margin - Vertical clearance for enemy movement.
     * @param {number} minimum - Lowest allowed numeric y value.
     * @returns {number} Maximum safe vertical spawn coordinate.
     */
    getMaximumY(typeConfig, visibleBounds, margin, minimum) {
        const floorY = this.level.height -
            this.level.config.world.floorHeight;
        const cameraMaximum = visibleBounds.bottom -
            typeConfig.height - 20 - margin;
        const floorMaximum = floorY - typeConfig.height - 20 - margin;
        return Math.max(minimum, Math.min(cameraMaximum, floorMaximum));
    }

    /**
     * @param {Object} movement - Movement profile for the enemy type.
     * @returns {number} Required vertical movement margin.
     */
    getMovementVerticalMargin(movement) {
        if (movement.profile === 'waveLeft') {
            return movement.waveAmplitude;
        }
        return movement.verticalRange / 2;
    }

    /**
     * @param {Object} candidate - Proposed enemy rectangle.
     * @param {Character} player - Current player.
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
     * @param {Object} candidate - Proposed enemy rectangle.
     * @returns {boolean} Whether the candidate is inside the world.
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
     * @param {Object} candidate - Proposed enemy rectangle.
     * @param {Character} player - Current player.
     * @returns {boolean} Whether the candidate is far from the player.
     */
    hasSafePlayerDistance(candidate, player) {
        const candidateX = candidate.x + candidate.width / 2;
        const candidateY = candidate.y + candidate.height / 2;
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;
        return Math.hypot(candidateX - playerX, candidateY - playerY) >=
            this.config.minimumPlayerDistance;
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
     * @param {Object} candidate - Proposed enemy rectangle.
     * @param {Object[]} areas - World rectangles to check.
     * @returns {boolean} Whether the candidate overlaps any area.
     */
    overlapsAny(candidate, areas) {
        return areas.some((area) => {
            return this.overlapsObject(candidate, area);
        });
    }

    /**
     * @param {Object} candidate - Proposed enemy rectangle.
     * @param {Object|null} object - World object to check, if present.
     * @returns {boolean} Whether the candidate overlaps an object.
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
}