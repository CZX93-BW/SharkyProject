'use strict';

/** Draws enemy details while their sprite images are loading. */
class EnemyFallbackRenderer {
    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Enemy} enemy - Enemy being drawn.
     */
    static drawEnemyDetails(context, enemy) {
        EnemyFallbackRenderer.drawEnemyEye(context, enemy);
        EnemyFallbackRenderer.drawEnemyTentacles(context, enemy);
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Enemy} enemy - Enemy being drawn.
     */
    static drawEnemyEye(context, enemy) {
        context.fillStyle = enemy.eyeColor;
        context.beginPath();
        context.arc(enemy.x + enemy.width / 2, enemy.y + 18, 6, 0, Math.PI * 2);
        context.fill();
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Enemy} enemy - Enemy being drawn.
     */
    static drawEnemyTentacles(context, enemy) {
        context.strokeStyle = enemy.fallbackColor;
        context.lineWidth = 4;
        EnemyFallbackRenderer.drawTentacle(context, enemy, 14);
        EnemyFallbackRenderer.drawTentacle(context, enemy, 29);
        EnemyFallbackRenderer.drawTentacle(context, enemy, 44);
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Enemy} enemy - Enemy being drawn.
     * @param {number} offsetX - Horizontal tentacle offset.
     */
    static drawTentacle(context, enemy, offsetX) {
        context.beginPath();
        context.moveTo(enemy.x + offsetX, enemy.y + enemy.height - 8);
        context.lineTo(enemy.x + offsetX - 6, enemy.y + enemy.height + 18);
        context.stroke();
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Endboss} enemy - Enemy being drawn.
     */
    static drawBossDetails(context, enemy) {
        EnemyFallbackRenderer.drawBossEye(context, enemy);
        EnemyFallbackRenderer.drawBossFins(context, enemy);
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Endboss} enemy - Enemy being drawn.
     */
    static drawBossEye(context, enemy) {
        context.fillStyle = enemy.eyeColor;
        context.beginPath();
        context.arc(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.28,
            enemy.height * 0.075, 0, Math.PI * 2);
        context.fill();
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Endboss} enemy - Enemy being drawn.
     */
    static drawBossFins(context, enemy) {
        context.fillStyle = enemy.fallbackColor;
        EnemyFallbackRenderer.drawTopFin(context, enemy);
        EnemyFallbackRenderer.drawTailFin(context, enemy);
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Endboss} enemy - Enemy being drawn.
     */
    static drawTopFin(context, enemy) {
        context.beginPath();
        context.moveTo(enemy.x + enemy.width * 0.4, enemy.y);
        context.lineTo(enemy.x + enemy.width * 0.61,
            enemy.y - enemy.height * 0.3);
        context.lineTo(enemy.x + enemy.width * 0.72, enemy.y);
        context.closePath();
        context.fill();
    }

    /**
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {Endboss} enemy - Enemy being drawn.
     */
    static drawTailFin(context, enemy) {
        context.beginPath();
        context.moveTo(enemy.x, enemy.y + enemy.height * 0.5);
        context.lineTo(enemy.x - enemy.width * 0.27,
            enemy.y + enemy.height * 0.2);
        context.lineTo(enemy.x - enemy.width * 0.27,
            enemy.y + enemy.height * 0.8);
        context.closePath();
        context.fill();
    }
}
