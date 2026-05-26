'use strict';

class AttackManager {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
        this.activeAttacks = [];
        this.lastAttackTimes = this.createLastAttackTimes();
        this.previousInputs = this.createPreviousInputs();
    }

    createLastAttackTimes() {
        return {
            finSlap: 0,
            poisonShot: 0,
            bubbleTrap: 0
        };
    }

    createPreviousInputs() {
        return {
            finSlap: false,
            poisonShot: false,
            bubbleTrap: false
        };
    }

    update(keyboard, gameState) {
        this.handleAttackInputs(keyboard, gameState);
        this.updateActiveAttacks();
        this.removeExpiredAttacks();
        this.updatePreviousInputs(keyboard);
    }

    handleAttackInputs(keyboard, gameState) {
        this.tryCreateFinSlap(keyboard, gameState);
        this.tryCreatePoisonShot(keyboard, gameState);
        this.tryCreateBubbleTrap(keyboard, gameState);
    }

    tryCreateFinSlap(keyboard, gameState) {
        if (this.canCreateFinSlap(keyboard)) {
            this.createAttack(new FinSlap(gameState.player), 'finSlap');
        }
    }

    tryCreatePoisonShot(keyboard, gameState) {
        if (this.canCreatePoisonShot(keyboard, gameState)) {
            gameState.usePoisonBottle();
            this.createAttack(new PoisonShot(gameState.player), 'poisonShot');
        }
    }

    tryCreateBubbleTrap(keyboard, gameState) {
        if (this.canCreateBubbleTrap(keyboard)) {
            this.createAttack(new BubbleTrap(gameState.player), 'bubbleTrap');
        }
    }

    canCreateFinSlap(keyboard) {
        return keyboard.isFinSlapPressed() &&
            !this.previousInputs.finSlap &&
            this.isCooldownReady('finSlap', GAME_CONFIG.finSlapCooldown);
    }

    canCreatePoisonShot(keyboard, gameState) {
        return keyboard.isPoisonAttackPressed() &&
            !this.previousInputs.poisonShot &&
            gameState.poisonBottles > 0 &&
            this.isCooldownReady('poisonShot', GAME_CONFIG.poisonShotCooldown);
    }

    canCreateBubbleTrap(keyboard) {
        return keyboard.isBubbleAttackPressed() &&
            !this.previousInputs.bubbleTrap &&
            this.isCooldownReady('bubbleTrap', GAME_CONFIG.bubbleTrapCooldown);
    }

    isCooldownReady(attackName, cooldown) {
        return Date.now() - this.lastAttackTimes[attackName] >= cooldown;
    }

    createAttack(attack, attackName) {
        this.activeAttacks.push(attack);
        this.lastAttackTimes[attackName] = Date.now();
        this.playAttackSound(attackName);
    }

    playAttackSound(attackName) {
        if (this.audioManager) {
            this.audioManager.playSound(attackName);
        }
    }

    updateActiveAttacks() {
        this.activeAttacks.forEach((attack) => attack.update());
    }

    removeExpiredAttacks() {
        this.activeAttacks = this.activeAttacks.filter((attack) => !attack.isExpired);
    }

    updatePreviousInputs(keyboard) {
        this.previousInputs.finSlap = keyboard.isFinSlapPressed();
        this.previousInputs.poisonShot = keyboard.isPoisonAttackPressed();
        this.previousInputs.bubbleTrap = keyboard.isBubbleAttackPressed();
    }

    reset() {
        this.activeAttacks = [];
        this.lastAttackTimes = this.createLastAttackTimes();
        this.previousInputs = this.createPreviousInputs();
    }

    getActiveAttacks() {
        return this.activeAttacks;
    }
}