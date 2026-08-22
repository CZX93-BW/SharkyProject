'use strict';

class PoisonShot extends AttackObject {
    constructor(player) {
        super({
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
        });

        this.poisonTickDamage = GAME_CONFIG.poisonShotTickDamage;
        this.poisonDuration = GAME_CONFIG.poisonShotDuration;
        this.poisonTickInterval = GAME_CONFIG.poisonShotTickInterval;
    }

    static getStartX(player) {
        if (player.direction === 1) {
            return player.x + player.width;
        }

        return player.x - GAME_CONFIG.poisonShotWidth;
    }

    drawFallback(context) {
        context.fillStyle = this.fallbackColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}