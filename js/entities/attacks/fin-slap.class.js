'use strict';

class FinSlap extends AttackObject {
    constructor(player) {
        super({
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
        });
    }

    static getStartX(player) {
        if (player.direction === 1) {
            return player.x + player.width - 4;
        }

        return player.x - GAME_CONFIG.finSlapWidth + 4;
    }

    update() {
        this.expireWhenDurationIsOver();
    }

    /** Keeps the technical melee hitbox invisible during normal rendering. */
    drawFallback() {}
}