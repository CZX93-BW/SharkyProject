'use strict';

class CollisionManager {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
    }

    resolvePlayerSolidAreaCollisions(player, solidAreas, previousPosition) {
        solidAreas.forEach((solidArea) => {
            if (this.isOverlapping(player, solidArea)) {
                this.resolveSolidAreaCollision(
                    player,
                    solidArea,
                    previousPosition
                );
            }
        });
    }

    resolveSolidAreaCollision(player, solidArea, previousPosition) {
        const previousSides = this.getPreviousSides(player, previousPosition);

        if (previousSides.bottom <= solidArea.y) {
            this.movePlayerAboveArea(player, solidArea);
            return;
        }

        if (previousSides.top >= solidArea.y + solidArea.height) {
            this.movePlayerBelowArea(player, solidArea);
            return;
        }

        if (previousSides.right <= solidArea.x) {
            this.movePlayerLeftOfArea(player, solidArea);
            return;
        }

        this.movePlayerRightOfArea(player, solidArea);
    }

    getPreviousSides(player, previousPosition) {
        return {
            left: previousPosition.x,
            right: previousPosition.x + player.width,
            top: previousPosition.y,
            bottom: previousPosition.y + player.height
        };
    }

    movePlayerAboveArea(player, solidArea) {
        player.y = solidArea.y - player.height;
        player.velocityY = 0;
    }

    movePlayerBelowArea(player, solidArea) {
        player.y = solidArea.y + solidArea.height;
        player.velocityY = 0;
    }

    movePlayerLeftOfArea(player, solidArea) {
        player.x = solidArea.x - player.width;
        player.velocityX = 0;
    }

    movePlayerRightOfArea(player, solidArea) {
        player.x = solidArea.x + solidArea.width;
        player.velocityX = 0;
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
        if (!this.canCollect(gameState, collectible)) {
            return;
        }

        this.applyCollectible(gameState, collectible);
        collectible.collect();
    }

    canCollect(gameState, collectible) {
        return !collectible.isCollected &&
            this.canAcceptCollectible(gameState, collectible) &&
            this.isOverlapping(gameState.player, collectible);
    }

    /** Keeps full poison pickups available until inventory has space. */
    canAcceptCollectible(gameState, collectible) {
        if (collectible.type !== 'poisonBottle') {
            return true;
        }

        return gameState.canCollectPoisonBottle(collectible.value);
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

        attacks.forEach((attack) => {
            this.checkAttackSolidAreaCollisions(attack, level.solidAreas);

            if (!attack.isExpired) {
                this.checkAttackTargets(attack, targets);
            }
        });
    }

    checkAttackSolidAreaCollisions(attack, solidAreas) {
        if (!this.isProjectileAttack(attack)) {
            return;
        }

        const hitsSolidArea = solidAreas.some((solidArea) => {
            return this.isOverlapping(attack, solidArea);
        });

        if (hitsSolidArea) {
            attack.expire();
        }
    }

    isProjectileAttack(attack) {
        return attack.type === 'poisonShot' ||
            attack.type === 'bubbleTrap';
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
        return firstObject.x + firstObject.width > secondObject.x &&
            firstObject.x < secondObject.x + secondObject.width &&
            firstObject.y + firstObject.height > secondObject.y &&
            firstObject.y < secondObject.y + secondObject.height;
    }
}