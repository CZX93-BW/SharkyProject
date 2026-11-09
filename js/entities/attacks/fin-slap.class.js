'use strict';

/** Tracks the visible fin during the contact frames of Sharky's swipe. */
class FinSlap extends AttackObject {
    /** @param {Character} player - Character performing the slap. */
    constructor(player) {
        super({
            x: player.x, y: player.y,
            width: GAME_CONFIG.finSlapReach + GAME_CONFIG.finSlapBodyOverlap,
            height: GAME_CONFIG.finSlapHeight,
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
        this.x = player.direction === 1 ?
            player.x + player.width - GAME_CONFIG.finSlapBodyOverlap :
            player.x - GAME_CONFIG.finSlapReach;
        this.y = player.y + 9;
    }

    /** @returns {boolean} Whether animation frames five through seven show fin contact. */
    isActive() {
        const frame = this.player.currentFrameIndex;
        return frame >= 4 && frame <= 6 && super.isActive();
    }

    /** @param {CanvasRenderingContext2D} context - Draws the water sweep at its active reach. */
    drawFallback(context) {
        if (!this.isActive()) {
            return;
        }
        const right = this.player.direction === 1;
        const centerX = right ? this.player.x + this.player.width : this.player.x;
        context.save();
        context.beginPath();
        context.ellipse(centerX, this.y + this.height / 2, GAME_CONFIG.finSlapReach,
            this.height / 2, right ? 0 : Math.PI, -Math.PI / 2, Math.PI / 2);
        context.strokeStyle = 'rgba(177, 240, 255, 0.72)';
        context.lineWidth = 2;
        context.stroke();
        context.restore();
    }
}
