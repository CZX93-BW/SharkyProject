'use strict';

/**
 * Represents the short-lived hitbox of the player's melee fin attack.
 *
 * @extends AttackObject
 */
class FinSlap extends AttackObject {
    /**
     * Creates a fin-slap hitbox beside the player.
     *
     * @param {Character} player - Character performing the fin slap.
     */
    constructor(player) {
        super(FinSlap.createConfig(player));
    }

    /**
     * Creates the shared attack configuration for a fin slap.
     *
     * @param {Character} player - Character performing the fin slap.
     * @returns {Object} Fin-slap configuration.
     */
    static createConfig(player) {
        return {
            x: FinSlap.getStartX(player),
            y: player.y - 4,
            width: GAME_CONFIG.finSlapWidth,
            height: GAME_CONFIG.finSlapHeight,
            type: 'finSlap',
            damage: GAME_CONFIG.finSlapDamage,
            direction: player.direction,
            duration: GAME_CONFIG.finSlapDuration,
            fallbackColor: GAME_CONFIG.finSlapFallbackColor,
            imagePath: ASSET_CONFIG.attacks.finSlap
        };
    }

    /**
     * Calculates the horizontal spawn position beside the player.
     *
     * @param {Character} player - Character performing the fin slap.
     * @returns {number} Horizontal spawn position.
     */
    static getStartX(player) {
        if (player.direction === 1) {
            return player.x + player.width - 4;
        }
        return player.x - GAME_CONFIG.finSlapWidth + 4;
    }

    /**
     * Updates the lifetime of the stationary melee hitbox.
     *
     * @returns {void}
     */
    update() {
        this.expireWhenDurationIsOver();
    }

    /**
     * Keeps the technical melee hitbox invisible without an image.
     *
     * @returns {void}
     */
    drawFallback() {}
}