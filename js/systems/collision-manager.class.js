'use strict';

/** Resolves solid areas, pickups, enemy contact, and player attack collisions. */
class CollisionManager {
    /** @param {AudioManager|null} [audioManager=null] - Game audio controller. */
    constructor(audioManager = null) {
        this.audioManager = audioManager;
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object[]} solidAreas - Blocking world areas.
     * @param {Object} previousPosition - Position before player movement.
     */
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

    /**
     * @param {Character} player - Current player character.
     * @param {Object} solidArea - Overlapping blocking area.
     * @param {Object} previousPosition - Position before player movement.
     */
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
        this.resolveHorizontalCollision(player, solidArea, previousSides);
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} solidArea - Overlapping blocking area.
     * @param {Object} previousSides - Player sides before movement.
     */
    resolveHorizontalCollision(player, solidArea, previousSides) {
        if (previousSides.right <= solidArea.x) {
            this.movePlayerLeftOfArea(player, solidArea);
            return;
        }
        this.movePlayerRightOfArea(player, solidArea);
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} previousPosition - Position before player movement.
     * @returns {Object} Player sides before movement.
     */
    getPreviousSides(player, previousPosition) {
        return {
            left: previousPosition.x,
            right: previousPosition.x + player.width,
            top: previousPosition.y,
            bottom: previousPosition.y + player.height
        };
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} solidArea - Blocking Blocking world area.
     */
    movePlayerAboveArea(player, solidArea) {
        player.y = solidArea.y - player.height;
        player.velocityY = 0;
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} solidArea - Blocking world area.
     */
    movePlayerBelowArea(player, solidArea) {
        player.y = solidArea.y + solidArea.height;
        player.velocityY = 0;
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} solidArea - Blocking world area.
     */
    movePlayerLeftOfArea(player, solidArea) {
        player.x = solidArea.x - player.width;
        player.velocityX = 0;
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Object} solidArea - Blocking world area.
     */
    movePlayerRightOfArea(player, solidArea) {
        player.x = solidArea.x + solidArea.width;
        player.velocityX = 0;
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Enemy[]} enemies - Active dangerous enemies.
     */
    checkPlayerEnemyCollisions(player, enemies) {
        enemies.forEach((enemy) => {
            this.checkPlayerEnemyCollision(player, enemy);
        });
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Enemy} enemy - Enemy considered for contact damage.
     */
    checkPlayerEnemyCollision(player, enemy) {
        if (!this.canEnemyDamagePlayer(player, enemy)) {
            return;
        }
        this.applyEnemyDamage(player, enemy);
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Enemy} enemy - Enemy considered for contact damage.
     * @returns {boolean} Whether the enemy currently damages the player.
     */
    canEnemyDamagePlayer(player, enemy) {
        return enemy.canDealContactDamage() &&
            this.isOverlapping(player, enemy);
    }

    /**
     * @param {Character} player - Current player character.
     * @param {Enemy} enemy - Enemy dealing contact damage.
     */
    applyEnemyDamage(player, enemy) {
        const healthBeforeDamage = player.health;
        player.takeDamage(enemy.damage);
        this.playDamageSoundIfNeeded(player, healthBeforeDamage, enemy);
    }

    /**
     * @param {Character} player - Current player character.
     * @param {number} healthBeforeDamage - Health before the damage attempt.
     * @param {Enemy} enemy - Enemy that caused the damage.
     */
    playDamageSoundIfNeeded(player, healthBeforeDamage, enemy) {
        if (player.health >= healthBeforeDamage) {
            return;
        }
        const playerSound = player.isAlive() ? 'playerHurt' : 'playerDeath';
        this.playSound(playerSound);
        this.audioManager?.playEnemyContactSound(enemy.type);
    }

    /** @param {GameState} gameState - Current game state. */
    checkPlayerCollectibleCollisions(gameState) {
        gameState.activeLevel.collectibles.forEach((collectible) => {
            this.checkPlayerCollectibleCollision(gameState, collectible);
        });
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {CollectibleObject} collectible - Collectible to inspect.
     */
    checkPlayerCollectibleCollision(gameState, collectible) {
        if (!this.canCollect(gameState, collectible)) {
            return;
        }
        this.applyCollectible(gameState, collectible);
        collectible.collect();
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {CollectibleObject} collectible - Collectible to inspect.
     * @returns {boolean} Whether the collectible can currently be collected.
     */
    canCollect(gameState, collectible) {
        return !collectible.isCollected &&
            this.canAcceptCollectible(gameState, collectible) &&
            this.isOverlapping(gameState.player, collectible);
    }

    /**
     * Keeps full poison pickups available until inventory has space.
     *
     * @param {GameState} gameState - Current game state.
     * @param {CollectibleObject} collectible - Collectible to inspect.
     * @returns {boolean} Whether the inventory can accept the collectible.
     */
    canAcceptCollectible(gameState, collectible) {
        if (collectible.type !== 'poisonBottle') {
            return true;
        }
        return gameState.canCollectPoisonBottle(collectible.value);
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {CollectibleObject} collectible - Collected world object.
     */
    applyCollectible(gameState, collectible) {
        if (collectible.type === 'coin') {
            this.applyCoinCollectible(gameState, collectible);
            return;
        }
        this.applyPoisonBottleCollectible(gameState, collectible);
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {CollectibleObject} collectible - Collected coin.
     */
    applyCoinCollectible(gameState, collectible) {
        gameState.collectCoin(collectible.value);
        this.playSound('coin');
    }

    /**
     * @param {GameState} gameState - Current game state.
     * @param {CollectibleObject} collectible - Collected poison bottle.
     */
    applyPoisonBottleCollectible(gameState, collectible) {
        gameState.collectPoisonBottle(collectible.value);
        this.playSound('poisonBottle');
    }

    /**
     * @param {AttackManager} attackManager - Active attack controller.
     * @param {Level} level - Active game level.
     */
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

    /**
     * @param {AttackObject} attack - Player attack to inspect.
     * @param {Object[]} solidAreas - Blocking world areas.
     */
    checkAttackSolidAreaCollisions(attack, solidAreas) {
        if (!this.isProjectileAttack(attack)) {
            return;
        }
        const hitsSolidArea = solidAreas.some((solidArea) => {
            return this.isOverlapping(attack, solidArea);
        });
        if (hitsSolidArea) {
            this.playSound('bubblePop');
            attack.expire();
        }
    }

    /**
     * @param {AttackObject} attack - Player attack to inspect.
     * @returns {boolean} Whether the attack behaves as a projectile.
     */
    isProjectileAttack(attack) {
        return attack.type === 'poisonShot' ||
            attack.type === 'bubbleTrap';
    }

    /**
     * @param {AttackObject} attack - Player attack to inspect.
     * @param {Enemy[]} targets - Active attack targets.
     */
    checkAttackTargets(attack, targets) {
        targets.forEach((target) => this.checkAttackTarget(attack, target));
    }

    /**
     * @param {AttackObject} attack - Player attack to inspect.
     * @param {Enemy} target - Potential attack target.
     */
    checkAttackTarget(attack, target) {
        if (!this.canAttackHitTarget(attack, target)) {
            return;
        }
        this.applyAttackHit(attack, target);
    }

    /**
     * @param {AttackObject} attack - Player attack to inspect.
     * @param {Enemy} target - Potential attack target.
     * @returns {boolean} Whether this attack may hit this target.
     */
    canAttackHitTarget(attack, target) {
        return !attack.hasHit(target) &&
            !target.isDefeated &&
            this.isOverlapping(attack, target);
    }

    /**
     * @param {AttackObject} attack - Player attack that hit.
     * @param {Enemy} target - Hit attack target.
     */
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

    /**
     * @param {AttackObject} attack - Fin Slap attack that hit.
     * @param {Enemy} target - Hit attack target.
     */
    applyFinSlapHit(attack, target) {
        target.takeDamage(attack.damage);
        attack.registerHit(target);
    }

    /**
     * @param {AttackObject} attack - Poison Shot attack that hit.
     * @param {Enemy} target - Hit attack target.
     */
    applyPoisonShotHit(attack, target) {
        target.takeDamage(attack.damage);
        target.applyPoison(
            attack.poisonTickDamage,
            attack.poisonDuration,
            attack.poisonTickInterval
        );
        attack.registerHit(target);
        this.playSound('bubblePop');
        attack.expire();
    }

    /**
     * @param {AttackObject} attack - Bubble Trap attack that hit.
     * @param {Enemy} target - Hit attack target.
     */
    applyBubbleTrapHit(attack, target) {
        if (target.canBeTrapped()) {
            target.trap(attack.trapDuration);
        }
        attack.registerHit(target);
        this.playSound('bubblePop');
        attack.expire();
    }

    /** @param {string} soundName - Registered sound effect name. */
    playSound(soundName) {
        if (this.audioManager) {
            this.audioManager.playSound(soundName);
        }
    }

    /**
     * @param {Object} firstObject - First rectangular object.
     * @param {Object} secondObject - Second rectangular object.
     * @returns {boolean} Whether the two objects overlap.
     */
    isOverlapping(firstObject, secondObject) {
        return firstObject.x + firstObject.width > secondObject.x &&
            firstObject.x < secondObject.x + secondObject.width &&
            firstObject.y + firstObject.height > secondObject.y &&
            firstObject.y < secondObject.y + secondObject.height;
    }
}