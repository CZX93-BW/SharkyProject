'use strict';

class CollisionManager {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
    }

    checkPlayerEnemyCollisions(player, enemies) {
        enemies.forEach((enemy) => this.checkPlayerEnemyCollision(player, enemy));
    }

    checkPlayerEnemyCollision(player, enemy) {
        if (!this.canEnemyDamagePlayer(player, enemy)) {
            return;
        }

        this.applyEnemyDamage(player, enemy);
    }

    canEnemyDamagePlayer(player, enemy) {
        return enemy.canDealContactDamage() && this.isOverlapping(player, enemy);
    }

    applyEnemyDamage(player, enemy) {
        const healthBeforeDamage = player.health;
        player.takeDamage(enemy.damage);
        this.playDamageSoundIfNeeded(player, healthBeforeDamage);
    }

    playDamageSoundIfNeeded(player, healthBeforeDamage) {
        if (player.health < healthBeforeDamage) {
            this.playSound('damage');
        }
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
            this.applyCoinCollectible(gameState, collectible);
            return;
        }

        this.applyPoisonBottleCollectible(gameState, collectible);
    }

    applyCoinCollectible(gameState, collectible) {
        gameState.collectCoin(collectible.value);
        this.playSound('coin');
    }

    applyPoisonBottleCollectible(gameState, collectible) {
        gameState.collectPoisonBottle(collectible.value);
        this.playSound('poisonBottle');
    }

    checkAttackCollisions(attackManager, level) {
        const attacks = attackManager.getActiveAttacks();
        const targets = level.getAttackTargets();

        attacks.forEach((attack) => this.checkAttackTargets(attack, targets));
    }

    checkAttackTargets(attack, targets) {
        targets.forEach((target) => this.checkAttackTarget(attack, target));
    }

    checkAttackTarget(attack, target) {
        if (!this.canAttackHitTarget(attack, target)) {
            return;
        }

        this.applyAttackHit(attack, target);
    }

    canAttackHitTarget(attack, target) {
        return !attack.hasHit(target) &&
            !target.isDefeated &&
            this.isOverlapping(attack, target);
    }

    applyAttackHit(attack, target) {
        if (attack.type === 'finSlap') {
            this.applyFinSlapHit(attack, target);
        }

        if (attack.type === 'poisonShot') {
            this.applyPoisonShotHit(attack, target);
        }

        if (attack.type === 'bubbleTrap') {
            this.applyBubbleTrapHit(attack, target);
        }
    }

    applyFinSlapHit(attack, target) {
        target.takeDamage(attack.damage);
        attack.registerHit(target);
    }

    applyPoisonShotHit(attack, target) {
        target.takeDamage(attack.damage);
        target.applyPoison(
            attack.poisonTickDamage,
            attack.poisonDuration,
            attack.poisonTickInterval
        );
        attack.registerHit(target);
        attack.expire();
    }

    applyBubbleTrapHit(attack, target) {
        if (target.canBeTrapped()) {
            target.trap(attack.trapDuration);
        }

        attack.registerHit(target);
        attack.expire();
    }

    playSound(soundName) {
        if (this.audioManager) {
            this.audioManager.playSound(soundName);
        }
    }

    isOverlapping(firstObject, secondObject) {
        return firstObject.getRightSide() > secondObject.x &&
            firstObject.x < secondObject.getRightSide() &&
            firstObject.getBottomSide() > secondObject.y &&
            firstObject.y < secondObject.getBottomSide();
    }
}