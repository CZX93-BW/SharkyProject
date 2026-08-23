'use strict';

/**
 * Represents the level exit and controls its locked and unlocked appearance.
 *
 * @extends DrawableObject
 */
class FinishObject extends DrawableObject {
    /**
     * Creates the level exit at the supplied world position.
     *
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     */
    constructor(x, y) {
        super(
            x,
            y,
            GAME_CONFIG.finishObjectWidth,
            GAME_CONFIG.finishObjectHeight
        );
        this.isUnlocked = false;
        this.fallbackColor = GAME_CONFIG.finishObjectFallbackColor;
        this.loadImage(ASSET_CONFIG.levelObjects.finish);
    }

    /** @param {boolean} isUnlocked - Whether the level exit is accessible. */
    setUnlocked(isUnlocked) {
        this.isUnlocked = isUnlocked;
    }

    /**
     * @param {Character} player - Current player instance.
     * @returns {boolean} Whether the player overlaps the finish object.
     */
    isReachedBy(player) {
        return player.getRightSide() > this.x &&
            player.x < this.getRightSide() &&
            player.getBottomSide() > this.y &&
            player.y < this.getBottomSide();
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    draw(context) {
        context.save();
        context.globalAlpha = this.isUnlocked ? 1 : 0.45;
        if (this.isImageReady()) {
            this.drawReadyFinish(context);
            context.restore();
            return;
        }
        this.drawFallbackGoal(context);
        context.restore();
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawReadyFinish(context) {
        super.draw(context);
        if (!this.isUnlocked) {
            this.drawLock(context);
        }
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawFallbackGoal(context) {
        this.drawGoalGlow(context);
        this.drawGoalFrame(context);
        this.drawGoalCenter(context);
        if (!this.isUnlocked) {
            this.drawLock(context);
        }
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawGoalGlow(context) {
        context.fillStyle = 'rgba(143, 255, 234, 0.22)';
        context.fillRect(
            this.x - 12,
            this.y - 12,
            this.width + 24,
            this.height + 24
        );
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawGoalFrame(context) {
        context.strokeStyle = this.fallbackColor;
        context.lineWidth = 5;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawGoalCenter(context) {
        context.fillStyle = 'rgba(143, 255, 234, 0.18)';
        context.fillRect(
            this.x + 14,
            this.y + 14,
            this.width - 28,
            this.height - 28
        );
    }

    /** @param {CanvasRenderingContext2D} context - Canvas rendering context. */
    drawLock(context) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        context.strokeStyle = '#ffffff';
        context.lineWidth = 5;
        context.beginPath();
        context.arc(centerX, centerY - 12, 15, Math.PI, 0);
        context.stroke();
        context.fillStyle = '#ffffff';
        context.fillRect(centerX - 20, centerY - 12, 40, 34);
    }
}