'use strict';

class CollisionManager {
    checkPlayerEnemyCollisions(player, enemies) {
        enemies.forEach((enemy) => this.checkPlayerEnemyCollision(player, enemy));
    }

    checkPlayerEnemyCollision(player, enemy) {
        if (!player.isCollidingWith(enemy)) {
            return;
        }

        player.takeDamage(enemy.damage);
    }
}