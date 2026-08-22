'use strict';

class RandomGenerator {
    /** Creates an injectable random source for deterministic tests. */
    constructor(randomSource = Math.random) {
        this.randomSource = randomSource;
    }

    /** Returns one normalized random value below one. */
    next() {
        const value = this.randomSource();
        return Math.min(Math.max(value, 0), 0.999999999);
    }

    /** Returns a floating-point value inside the given range. */
    between(minimum, maximum) {
        return minimum + this.next() * (maximum - minimum);
    }

    /** Returns an inclusive random integer. */
    integer(minimum, maximum) {
        return Math.floor(this.between(minimum, maximum + 1));
    }

    /** Selects one entry according to its configured weight. */
    pickWeighted(entries, weightSelector) {
        if (!entries.length) {
            return null;
        }

        const totalWeight = entries.reduce((sum, entry) => {
            return sum + weightSelector(entry);
        }, 0);
        let threshold = this.next() * totalWeight;

        for (const entry of entries) {
            threshold -= weightSelector(entry);

            if (threshold <= 0) {
                return entry;
            }
        }

        return entries[entries.length - 1];
    }
}