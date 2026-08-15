'use strict';

class CollisionManager {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
    }

    /** Resolves collisions with every solid level area. */
    resolvePlayerSolidAreaCollisions(
        player,
        solidAreas,
        previousPosition
    ) {
        solidAreas.forEach((solidArea) => {
            if (
                this.isOverlapping(
                    player,
                    solidArea
                )
            ) {
                this.resolveSolidAreaCollision(
                    player,
                    solidArea,
                    previousPosition
                );
            }
        });
    }

    /** Moves the player back to the collision edge. */
    resolveSolidAreaCollision(
        player,
        solidArea,
        previousPosition
    ) {
        const previousSides =
            this.getPreviousSides(
                player,
                previousPosition
            );

        if (
            previousSides.bottom <=
            solidArea.y
        ) {
            this.movePlayerAboveArea(
                player,
                solidArea
            );
            return;
        }

        if (
            previousSides.top >=
            solidArea.y + solidArea.height
        ) {
            this.movePlayerBelowArea(
                player,
                solidArea
            );
            return;
        }

        if (
            previousSides.right <=
            solidArea.x
        ) {
            this.movePlayerLeftOfArea(
                player,
                solidArea
            );
            return;
        }

        this.movePlayerRightOfArea(
            player,
            solidArea
        );
    }

    /** Returns the player's sides before movement. */
    getPreviousSides(player, previousPosition) {
        return {
            left: previousPosition.x,
            right:
                previousPosition.x +
                player.width,
            top: previousPosition.y,
            bottom:
                previousPosition.y +
                player.height
        };
    }

    /** Places the player above an area. */
    movePlayerAboveArea(player, solidArea) {
        player.y =
            solidArea.y - player.height;
        player.velocityY = 0;
    }

    /** Places the player below an area. */
    movePlayerBelowArea(player, solidArea) {
        player.y =
            solidArea.y + solidArea.height;
        player.velocityY = 0;
    }

    /** Places the player left of an area. */
    movePlayerLeftOfArea(player, solidArea) {
        player.x =
            solidArea.x - player.width;
        player.velocityX = 0;
    }

    /** Places the player right of an area. */
    movePlayerRightOfArea(player, solidArea) {
        player.x =
            solidArea.x + solidArea.width;
        player.velocityX = 0;
    }

    checkPlayerEnemyCollisions(
        player,
        enemies
    ) {
        enemies.forEach((enemy) => {
            this.checkPlayerEnemyCollision(
                player,
                enemy
            );
        });
    }

    checkPlayerEnemyCollision(
        player,
        enemy
    ) {
        if (
            !this.canEnemyDamagePlayer(
                player,
                enemy
            )
        ) {
            return;
        }

        this.applyEnemyDamage(player, enemy);
    }

    canEnemyDamagePlayer(player, enemy) {
        return enemy.canDealContactDamage() &&
            this.isOverlapping(player, enemy);
    }

    applyEnemyDamage(player, enemy) {
        const healthBeforeDamage =
            player.health;

        player.takeDamage(enemy.damage);

        this.playDamageSoundIfNeeded(
            player,
            healthBeforeDamage
        );
    }

    playDamageSoundIfNeeded(
        player,
        healthBeforeDamage
    ) {
        if (
            player.health <
            healthBeforeDamage
        ) {
            this.playSound('damage');
        }
    }

    checkPlayerCollectibleCollisions(
        gameState
    ) {
        gameState.activeLevel.collectibles
            .forEach((collectible) => {
                this.checkPlayerCollectibleCollision(
                    gameState,
                    collectible
                );
            });
    }

    checkPlayerCollectibleCollision(
        gameState,
        collectible
    ) {
        if (
            !this.canCollect(
                gameState.player,
                collectible
            )
        ) {
            return;
        }

        this.applyCollectible(
            gameState,
            collectible
        );
        collectible.collect();
    }

    canCollect(player, collectible) {
        return !collectible.isCollected &&
            this.isOverlapping(
                player,
                collectible
            );
    }

    applyCollectible(
        gameState,
        collectible
    ) {
        if (collectible.type === 'coin') {
            this.applyCoinCollectible(
                gameState,
                collectible
            );
            return;
        }

        this.applyPoisonBottleCollectible(
            gameState,
            collectible
        );
    }

    applyCoinCollectible(
        gameState,
        collectible
    ) {
        gameState.collectCoin(
            collectible.value
        );
        this.playSound('coin');
    }

    applyPoisonBottleCollectible(
        gameState,
        collectible
    ) {
        gameState.collectPoisonBottle(
            collectible.value
        );
        this.playSound('poisonBottle');
    }

    checkAttackCollisions(
        attackManager,
        level
    ) {
        const attacks =
            attackManager.getActiveAttacks();
        const targets =
            level.getAttackTargets();

        attacks.forEach((attack) => {
            this.checkAttackTargets(
                attack,
                targets
            );
        });
    }

    checkAttackTargets(attack, targets) {
        targets.forEach((target) => {
            this.checkAttackTarget(
                attack,
                target
            );
        });
    }

    checkAttackTarget(attack, target) {
        if (
            !this.canAttackHitTarget(
                attack,
                target
            )
        ) {
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
            this.applyFinSlapHit(
                attack,
                target
            );
        }

        if (attack.type === 'poisonShot') {
            this.applyPoisonShotHit(
                attack,
                target
            );
        }

        if (attack.type === 'bubbleTrap') {
            this.applyBubbleTrapHit(
                attack,
                target
            );
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
            target.trap(
                attack.trapDuration
            );
        }

        attack.registerHit(target);
        attack.expire();
    }

    playSound(soundName) {
        if (this.audioManager) {
            this.audioManager.playSound(
                soundName
            );
        }
    }

    /** Checks overlap for class instances and plain areas. */
    isOverlapping(
        firstObject,
        secondObject
    ) {
        return firstObject.x +
            firstObject.width >
            secondObject.x &&
            firstObject.x <
            secondObject.x +
            secondObject.width &&
            firstObject.y +
            firstObject.height >
            secondObject.y &&
            firstObject.y <
            secondObject.y +
            secondObject.height;
    }
}