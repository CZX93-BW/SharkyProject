'use strict';

/**
 * Represents a projectile that deals impact damage and applies poison damage.
 *
 * @extends AttackObject
 */
class PoisonShot extends AttackObject {
    /**
     * Creates a poison projectile at the player's current position.
     *
     * @param {Character} player - Character firing the poison shot.
     */
    constructor(player) {
        super(PoisonShot.createConfig(player));
        this.poisonTickDamage = GAME_CONFIG.poisonShotTickDamage;
        this.poisonDuration = GAME_CONFIG.poisonShotDuration;
        this.poisonTickInterval = GAME_CONFIG.poisonShotTickInterval;
    }

    /**
     * Creates the shared attack configuration for a poison shot.
     *
     * @param {Character} player - Character firing the poison shot.
     * @returns {Object} Poison-shot configuration.
     */
    static createConfig(player) {
        return {
            x: PoisonShot.getStartX(player),
            y: player.y + player.height / 2 - GAME_CONFIG.poisonShotHeight / 2,
            width: GAME_CONFIG.poisonShotWidth,
            height: GAME_CONFIG.poisonShotHeight,
            type: 'poisonShot',
            damage: GAME_CONFIG.poisonShotImpactDamage,
            speed: GAME_CONFIG.poisonShotSpeed,
            direction: player.direction,
            duration: GAME_CONFIG.poisonShotLifetime,
            fallbackColor: GAME_CONFIG.poisonShotFallbackColor,
            imagePath: ASSET_CONFIG.attacks.poisonShot
        };
    }

    /**
     * Calculates the horizontal spawn position beside the player.
     *
     * @param {Character} player - Character firing the poison shot.
     * @returns {number} Horizontal spawn position.
     */
    static getStartX(player) {
        if (player.direction === 1) {
            return player.x + player.width;
        }
        return player.x - GAME_CONFIG.poisonShotWidth;
    }

    /**
     * Draws a rectangular fallback when the projectile image is unavailable.
     *
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @returns {void}
     */
    drawFallback(context) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}