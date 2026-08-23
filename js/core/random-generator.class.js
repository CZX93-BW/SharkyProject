'use strict';

/**
 * Wraps random-number generation for reusable and deterministic game logic.
 * A custom source can be injected by automated tests.
 */
class RandomGenerator {
    /**
     * Creates a random generator.
     *
     * @param {Function} [randomSource=Math.random] - Random number source.
     */
    constructor(randomSource = Math.random) {
        this.randomSource = randomSource;
    }

    /**
     * Returns one normalized random value below one.
     *
     * @returns {number} Value between zero inclusive and one exclusive.
     */
    next() {
        const value = this.randomSource();
        return Math.min(Math.max(value, 0), 0.999999999);
    }

    /**
     * Returns a floating-point value inside a range.
     *
     * @param {number} minimum - Inclusive lower range boundary.
     * @param {number} maximum - Exclusive upper range boundary.
     * @returns {number} Random floating-point value.
     */
    between(minimum, maximum) {
        return minimum + this.next() * (maximum - minimum);
    }

    /**
     * Returns an integer inside an inclusive range.
     *
     * @param {number} minimum - Inclusive lower range boundary.
     * @param {number} maximum - Inclusive upper range boundary.
     * @returns {number} Random integer.
     */
    integer(minimum, maximum) {
        return Math.floor(this.between(minimum, maximum + 1));
    }

    /**
     * Selects one entry according to its configured weight.
     *
     * @template T
     * @param {T[]} entries - Entries participating in the selection.
     * @param {function(T): number} weightSelector - Weight selector.
     * @returns {T|null} Selected entry or null for an empty collection.
     */
    pickWeighted(entries, weightSelector) {
        if (!entries.length) {
            return null;
        }

        const totalWeight = this.getTotalWeight(entries, weightSelector);
        let threshold = this.next() * totalWeight;

        for (const entry of entries) {
            threshold -= weightSelector(entry);

            if (threshold <= 0) {
                return entry;
            }
        }

        return entries[entries.length - 1];
    }

    /**
     * Calculates the combined selection weight of all entries.
     *
     * @template T
     * @param {T[]} entries - Weighted entries.
     * @param {function(T): number} weightSelector - Weight selector.
     * @returns {number} Sum of all configured weights.
     */
    getTotalWeight(entries, weightSelector) {
        return entries.reduce((sum, entry) => {
            return sum + weightSelector(entry);
        }, 0);
    }
}