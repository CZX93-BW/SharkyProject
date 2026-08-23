'use strict';

/** Creates, updates, limits, and removes all active player attacks. */
class AttackManager {
    /** @param {AudioManager|null} [audioManager=null] - Game audio controller. */
    constructor(audioManager = null) {
        this.audioManager = audioManager;
        this.activeAttacks = [];
        this.lastAttackTimes = this.createLastAttackTimes();
        this.previousInputs = this.createPreviousInputs();
    }

    /** @returns {Object} Initial cooldown timestamps for every attack. */
    createLastAttackTimes() {
        return {
            finSlap: 0,
            poisonShot: 0,
            bubbleTrap: 0
        };
    }

    /** @returns {Object} Released input state for every attack. */
    createPreviousInputs() {
        return {
            finSlap: false,
            poisonShot: false,
            bubbleTrap: false
        };
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @param {GameState} gameState - Current game state.
     */
    update(keyboard, gameState) {
        this.handleAttackInputs(keyboard, gameState);
        this.updateActiveAttacks();
        this.removeExpiredAttacks();
        this.updatePreviousInputs(keyboard);
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @param {GameState} gameState - Current game state.
     */
    handleAttackInputs(keyboard, gameState) {
        this.tryCreateFinSlap(keyboard, gameState);
        this.tryCreatePoisonShot(keyboard, gameState);
        this.tryCreateBubbleTrap(keyboard, gameState);
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @param {GameState} gameState - Current game state.
     */
    tryCreateFinSlap(keyboard, gameState) {
        if (this.canCreateFinSlap(keyboard)) {
            gameState.player.startFinSlap();
            this.createAttack(new FinSlap(gameState.player), 'finSlap');
        }
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @param {GameState} gameState - Current game state.
     */
    tryCreatePoisonShot(keyboard, gameState) {
        if (this.canCreatePoisonShot(keyboard, gameState)) {
            gameState.usePoisonBottle();
            gameState.player.startPoisonShot();
            this.createAttack(new PoisonShot(gameState.player), 'poisonShot');
        }
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @param {GameState} gameState - Current game state.
     */
    tryCreateBubbleTrap(keyboard, gameState) {
        if (this.canCreateBubbleTrap(keyboard)) {
            gameState.player.startBubbleTrap();
            this.createAttack(new BubbleTrap(gameState.player), 'bubbleTrap');
        }
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @returns {boolean} Whether a new Fin Slap may be created.
     */
    canCreateFinSlap(keyboard) {
        return keyboard.isFinSlapPressed() &&
            !this.previousInputs.finSlap &&
            this.isCooldownReady('finSlap', GAME_CONFIG.finSlapCooldown);
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @param {GameState} gameState - Current game state.
     * @returns {boolean} Whether a new Poison Shot may be created.
     */
    canCreatePoisonShot(keyboard, gameState) {
        return keyboard.isPoisonAttackPressed() &&
            !this.previousInputs.poisonShot &&
            gameState.poisonBottles > 0 &&
            this.isCooldownReady('poisonShot', GAME_CONFIG.poisonShotCooldown);
    }

    /**
     * @param {Keyboard} keyboard - Current input state.
     * @returns {boolean} Whether a new Bubble Trap may be created.
     */
    canCreateBubbleTrap(keyboard) {
        return keyboard.isBubbleAttackPressed() &&
            !this.previousInputs.bubbleTrap &&
            this.isCooldownReady('bubbleTrap', GAME_CONFIG.bubbleTrapCooldown);
    }

    /**
     * @param {string} attackName - Registered attack name.
     * @param {number} cooldown - Required cooldown in milliseconds.
     * @returns {boolean} Whether the configured cooldown has elapsed.
     */
    isCooldownReady(attackName, cooldown) {
        return GAME_CLOCK.now() - this.lastAttackTimes[attackName] >= cooldown;
    }

    /**
     * @param {AttackObject} attack - Newly created attack instance.
     * @param {string} attackName - Registered attack name.
     */
    createAttack(attack, attackName) {
        this.activeAttacks.push(attack);
        this.lastAttackTimes[attackName] = GAME_CLOCK.now();
        this.playAttackSound(attackName);
    }

    /** @param {string} attackName - Sound name matching the created attack. */
    playAttackSound(attackName) {
        if (this.audioManager) {
            this.audioManager.playSound(attackName);
        }
    }

    /** Updates every active attack for one game frame. */
    updateActiveAttacks() {
        this.activeAttacks.forEach((attack) => attack.update());
    }

    /** Removes all expired attacks from the active collection. */
    removeExpiredAttacks() {
        this.activeAttacks = this.activeAttacks.filter((attack) => {
            return !attack.isExpired;
        });
    }

    /** @param {Keyboard} keyboard - Current input state. */
    updatePreviousInputs(keyboard) {
        this.previousInputs.finSlap = keyboard.isFinSlapPressed();
        this.previousInputs.poisonShot = keyboard.isPoisonAttackPressed();
        this.previousInputs.bubbleTrap = keyboard.isBubbleAttackPressed();
    }

    /** Clears all attacks, cooldowns, and previous input states. */
    reset() {
        this.activeAttacks = [];
        this.lastAttackTimes = this.createLastAttackTimes();
        this.previousInputs = this.createPreviousInputs();
    }

    /** @returns {AttackObject[]} Currently active player attacks. */
    getActiveAttacks() {
        return this.activeAttacks;
    }
}