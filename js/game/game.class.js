'use strict';

/** Coordinates the game lifecycle, updates, rendering, and status callbacks. */
class Game {
    /**
     * Creates the game services and renders the initial menu state.
     *
     * @param {HTMLCanvasElement} canvas - Canvas used to render the game.
     * @param {Keyboard} keyboard - Current keyboard and touch input state.
     * @param {Function|null} [statusUpdateCallback=null] - UI update callback.
     * @param {AudioManager|null} [audioManager=null] - Game audio controller.
     */
    constructor(canvas, keyboard, statusUpdateCallback = null, audioManager = null) {
        this.initializeDependencies(canvas, keyboard, statusUpdateCallback);
        this.initializeManagers(audioManager);
        this.initializeLoopState();
        this.renderCurrentState();
        this.notifyStatusUpdate();
    }

    /**
     * @param {HTMLCanvasElement} canvas - Canvas used to render the game.
     * @param {Keyboard} keyboard - Current input state.
     * @param {Function|null} statusUpdateCallback - UI update callback.
     */
    initializeDependencies(canvas, keyboard, statusUpdateCallback) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.statusUpdateCallback = statusUpdateCallback;
        this.gameState = new GameState();
        this.renderer = new GameRenderer(canvas);
        this.camera = new Camera(canvas);
    }

    /** @param {AudioManager|null} audioManager - Game audio controller. */
    initializeManagers(audioManager) {
        this.audioManager = audioManager;
        this.collisionManager = new CollisionManager(audioManager);
        this.attackManager = new AttackManager(audioManager);
    }

    /** Initializes animation-loop timing state. */
    initializeLoopState() {
        this.animationFrameId = null;
        this.lastFrameTime = 0;
    }

    /** @param {number} levelNumber - Number of the level to start. */
    start(levelNumber) {
        this.cancelRunningLoop();
        this.gameState.start(levelNumber);
        this.prepareStartedLevel();
    }

    /** @param {number} levelNumber - Number of the next level to start. */
    startNextLevel(levelNumber) {
        this.cancelRunningLoop();
        this.gameState.startNextLevel(levelNumber);
        this.prepareStartedLevel();
    }

    /** Resets runtime services and starts the animation loop. */
    prepareStartedLevel() {
        GAME_CLOCK.resume();
        this.resetInput();
        this.camera.reset();
        this.attackManager.reset();
        this.resetFrameTime();
        this.notifyStatusUpdate();
        this.runGameLoop();
    }

    /** @param {string} upgradeName - Name of the requested shop upgrade. */
    purchaseUpgrade(upgradeName) {
        this.gameState.purchaseUpgrade(upgradeName);
        this.notifyStatusUpdate();
    }

    /** Pauses gameplay and freezes the game clock after a valid transition. */
    pause() {
        this.gameState.pause();
        this.pauseGameClockIfNeeded();
        this.resetInput();
        this.notifyStatusUpdate();
    }

    /** Resumes gameplay and the game clock. */
    resume() {
        GAME_CLOCK.resume();
        this.gameState.resume();
        this.notifyStatusUpdate();
    }

    /** Stops the current session and restores the menu rendering state. */
    stop() {
        GAME_CLOCK.resume();
        this.gameState.stop();
        this.cancelRunningLoop();
        this.resetInput();
        this.camera.reset();
        this.attackManager.reset();
        this.renderCurrentState();
        this.notifyStatusUpdate();
    }

    /** Restarts the current level with a clean runtime state. */
    restart() {
        this.cancelRunningLoop();
        this.gameState.restartCurrentLevel();
        this.prepareStartedLevel();
    }

    /** Cancels the active animation frame request. */
    cancelRunningLoop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = null;
    }

    /** Releases all inputs at game lifecycle boundaries. */
    resetInput() {
        this.keyboard.resetAllInputs();
    }

    /** Freezes game time only after a valid pause transition. */
    pauseGameClockIfNeeded() {
        if (this.gameState.isPaused) {
            GAME_CLOCK.pause();
        }
    }

    /** Resets frame timing and the displayed frame rate. */
    resetFrameTime() {
        this.lastFrameTime = 0;
        this.gameState.setFramesPerSecond(0);
    }

    /** @param {number} [currentTime=0] - Animation frame timestamp. */
    runGameLoop(currentTime = 0) {
        this.updateFrameData(currentTime);
        this.update();
        this.renderCurrentState();
        this.notifyStatusUpdate();
        if (this.shouldContinueLoop()) {
            this.requestNextFrame();
        }
    }

    /** Renders the current world and interface state. */
    renderCurrentState() {
        this.renderer.render(this.gameState, this.camera, this.attackManager);
    }

    /** @returns {boolean} Whether the animation loop should continue. */
    shouldContinueLoop() {
        return this.gameState.isRunning;
    }

    /** Requests the next animation frame. */
    requestNextFrame() {
        this.animationFrameId = requestAnimationFrame(
            (currentTime) => this.runGameLoop(currentTime)
        );
    }

    /** @param {number} currentTime - Current animation frame timestamp. */
    updateFrameData(currentTime) {
        if (this.lastFrameTime > 0) {
            this.updateFramesPerSecond(currentTime);
        }
        this.lastFrameTime = currentTime;
    }

    /** @param {number} currentTime - Current animation frame timestamp. */
    updateFramesPerSecond(currentTime) {
        const frameDuration = currentTime - this.lastFrameTime;
        const framesPerSecond = Math.round(1000 / frameDuration);
        this.gameState.setFramesPerSecond(framesPerSecond);
    }

    /** Updates all active gameplay systems for one frame. */
    update() {
        if (!this.canUpdateGame()) {
            return;
        }
        if (!this.gameState.player.isAlive()) {
            this.updateDefeatSequence();
            return;
        }
        this.updateActiveGame();
    }

    /** Updates the active game systems in their required order. */
    updateActiveGame() {
        this.updatePlayer();
        this.updateCamera();
        this.updateAttacks();
        this.updateLevel();
        this.updateCollisions();
        this.updateGameStatus();
    }

    /** Updates player movement and resolves solid-area collisions. */
    updatePlayer() {
        const player = this.gameState.player;
        const levelBounds = this.gameState.activeLevel.getBounds();
        const previousPosition = { x: player.x, y: player.y };
        player.update(this.keyboard, levelBounds);
        this.collisionManager.resolvePlayerSolidAreaCollisions(
            player,
            this.gameState.activeLevel.solidAreas,
            previousPosition
        );
    }

    /** Updates all active attacks from the current input state. */
    updateAttacks() {
        this.attackManager.update(this.keyboard, this.gameState);
    }

    /** Updates the active level and its visible dynamic content. */
    updateLevel() {
        this.gameState.activeLevel.update(
            this.gameState.player,
            this.camera.getVisibleBounds()
        );
    }

    /** Runs danger, collectible, and attack collision checks. */
    updateCollisions() {
        this.checkDangerCollisions();
        this.checkCollectibleCollisions();
        this.checkAttackCollisions();
    }

    /** Checks collisions between the player and dangerous objects. */
    checkDangerCollisions() {
        this.collisionManager.checkPlayerEnemyCollisions(
            this.gameState.player,
            this.gameState.activeLevel.getDangerObjects()
        );
    }

    /** Checks collisions between the player and collectibles. */
    checkCollectibleCollisions() {
        this.collisionManager.checkPlayerCollectibleCollisions(this.gameState);
    }

    /** Checks collisions between active attacks and valid targets. */
    checkAttackCollisions() {
        this.collisionManager.checkAttackCollisions(
            this.attackManager,
            this.gameState.activeLevel
        );
    }

    /** Updates defeat or level-completion status after collision handling. */
    updateGameStatus() {
        if (!this.gameState.player.isAlive()) {
            this.startDefeatSequence();
            return;
        }
        this.completeLevelIfNeeded();
    }

    /** Starts the dead animation in the fatal collision frame. */
    startDefeatSequence() {
        this.gameState.player.resetVelocity();
        this.gameState.player.updateAnimation();
    }

    /** Advances the dead animation before opening Game Over. */
    updateDefeatSequence() {
        const player = this.gameState.player;
        player.resetVelocity();
        player.updateAnimation();
        if (player.isAnimationFinished()) {
            this.gameState.setGameOver();
        }
    }

    /** Completes the level when the unlocked finish has been reached. */
    completeLevelIfNeeded() {
        if (this.gameState.activeLevel.isLevelComplete(this.gameState.player)) {
            this.gameState.completeLevel();
        }
    }

    /** Updates the camera from the player and active level positions. */
    updateCamera() {
        this.camera.update(this.gameState.player, this.gameState.activeLevel);
    }

    /** @returns {boolean} Whether gameplay systems may update this frame. */
    canUpdateGame() {
        return this.gameState.isRunning &&
            !this.gameState.isPaused &&
            this.gameState.status === 'playing';
    }

    /** Notifies the interface when a status callback is available. */
    notifyStatusUpdate() {
        if (this.statusUpdateCallback) {
            this.statusUpdateCallback(this.gameState);
        }
    }
}