'use strict';

class BubbleTrap extends AttackObject {
    constructor(player) {
        super({
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
        });

        this.trapDuration = GAME_CONFIG.bubbleTrapDuration;
    }

    static getStartX(player) {
        if (player.direction === 1) {
            return player.x + player.width;
        }

        return player.x - GAME_CONFIG.bubbleTrapWidth;
    }

    drawFallback(context) {
        context.fillStyle = this.fallbackColor;
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        context.fill();
    }
}