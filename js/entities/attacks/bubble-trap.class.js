'use strict';

/**
 * Represents a moving bubble that traps an enemy on impact.
 *
 * @extends AttackObject
 */
class BubbleTrap extends AttackObject {
    /**
     * Creates a bubble trap at the player's current position.
     *
     * @param {Character} player - Character launching the bubble trap.
     */
    constructor(player) {
        super(BubbleTrap.createConfig(player));
        this.trapDuration = GAME_CONFIG.bubbleTrapDuration;
    }

    /**
     * Creates the shared attack configuration for a bubble trap.
     *
     * @param {Character} player - Character launching the bubble trap.
     * @returns {Object} Bubble trap configuration.
     */
    static createConfig(player) {
        return {
            x: BubbleTrap.getStartX(player),
            y: player.y + player.height / 2 - GAME_CONFIG.bubbleTrapHeight / 2,
            width: GAME_CONFIG.bubbleTrapWidth,
            height: GAME_CONFIG.bubbleTrapHeight,
            type: 'bubbleTrap',
            speed: GAME_CONFIG.bubbleTrapSpeed,
            direction: player.direction,
            duration: GAME_CONFIG.bubbleTrapLifetime,
            fallbackColor: GAME_CONFIG.bubbleTrapFallbackColor,
            imagePath: ASSET_CONFIG.attacks.bubbleTrap
        };
    }

    /**
     * Calculates the horizontal spawn position beside the player.
     *
     * @param {Character} player - Character launching the bubble trap.
     * @returns {number} Horizontal spawn position.
     */
    static getStartX(player) {
        if (player.direction === 1) {
            return player.x + player.width;
        }
        return player.x - GAME_CONFIG.bubbleTrapWidth;
    }

    /**
     * Draws a circular fallback when the bubble image is unavailable.
     *
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @returns {void}
     */
    drawFallback(context) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        context.fillStyle = this.fallbackColor;
        context.beginPath();
        context.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
        context.fill();
    }
}