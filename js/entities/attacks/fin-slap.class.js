'use strict';

/** Tracks the visible fin during the contact frames of Sharky's swipe. */
class FinSlap extends AttackObject {
    /** @param {Character} player - Character performing the slap. */
    constructor(player) {
        super({
            x: player.x, y: player.y,
            width: GAME_CONFIG.finSlapWidth, height: GAME_CONFIG.finSlapHeight,
            damage: GAME_CONFIG.finSlapDamage, type: 'finSlap'
        });
        this.player = player;
        this.update();
    }

    /** Follows the current facing direction until the swing ends or is interrupted. */
    update() {
        const player = this.player;
        if (player.currentAnimation !== 'finSlap' || player.isAnimationFinished()) {
            this.expire();
            return;
        }
        const tip = player.direction === 1 ? player.x + player.width + 5 : player.x - 5;
        this.x = player.direction === 1 ? tip - this.width : tip;
        this.y = player.y + 9;
    }

    /** @returns {boolean} Whether animation frames five through seven show fin contact. */
    isActive() {
        const frame = this.player.currentFrameIndex;
        return frame >= 4 && frame <= 6 && super.isActive();
    }

    /** The character sprite supplies the visual for this attack. */
    drawFallback() {}
}
