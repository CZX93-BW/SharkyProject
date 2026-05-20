'use strict';

class CollisionManager {
    checkPlayerEnemyCollisions(player, enemies) {
        enemies.forEach((enemy) => this.checkPlayerEnemyCollision(player, enemy));
    }

    checkPlayerEnemyCollision(player, enemy) {
        if (!this.isOverlapping(player, enemy)) {
            return;
        }

        player.takeDamage(enemy.damage);
    }

    checkPlayerCollectibleCollisions(gameState) {
        gameState.activeLevel.collectibles.forEach((collectible) => {
            this.checkPlayerCollectibleCollision(gameState, collectible);
        });
    }

    checkPlayerCollectibleCollision(gameState, collectible) {
        if (!this.canCollect(gameState.player, collectible)) {
            return;
        }

        this.applyCollectible(gameState, collectible);
        collectible.collect();
    }

    canCollect(player, collectible) {
        return !collectible.isCollected && this.isOverlapping(player, collectible);
    }

    applyCollectible(gameState, collectible) {
        if (collectible.type === 'coin') {
            gameState.collectCoin(collectible.value);
            return;
        }

        gameState.collectPoisonBottle(collectible.value);
    }

    isOverlapping(firstObject, secondObject) {
        return firstObject.getRightSide() > secondObject.x &&
            firstObject.x < secondObject.getRightSide() &&
            firstObject.getBottomSide() > secondObject.y &&
            firstObject.y < secondObject.getBottomSide();
    }
}