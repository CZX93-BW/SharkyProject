'use strict';

class FinishObject extends DrawableObject {
    constructor(x, y) {
        super(
            x,
            y,
            GAME_CONFIG.finishObjectWidth,
            GAME_CONFIG.finishObjectHeight
        );

        this.isUnlocked = false;
        this.fallbackColor =
            GAME_CONFIG.finishObjectFallbackColor;

        this.loadImage(
            ASSET_CONFIG.levelObjects.finish
        );
    }

    /** Updates the finish lock state. */
    setUnlocked(isUnlocked) {
        this.isUnlocked = isUnlocked;
    }

    /** Checks overlap with the player. */
    isReachedBy(player) {
        return player.getRightSide() >
            this.x &&
            player.x <
            this.getRightSide() &&
            player.getBottomSide() >
            this.y &&
            player.y <
            this.getBottomSide();
    }

    /** Draws the locked or unlocked finish. */
    draw(context) {
        context.save();

        context.globalAlpha =
            this.isUnlocked ? 1 : 0.45;

        if (this.isImageReady()) {
            super.draw(context);

            if (!this.isUnlocked) {
                this.drawLock(context);
            }

            context.restore();
            return;
        }

        this.drawFallbackGoal(context);
        context.restore();
    }

    /** Draws the fallback finish marker. */
    drawFallbackGoal(context) {
        this.drawGoalGlow(context);
        this.drawGoalFrame(context);
        this.drawGoalCenter(context);

        if (!this.isUnlocked) {
            this.drawLock(context);
        }
    }

    /** Draws the outer goal glow. */
    drawGoalGlow(context) {
        context.fillStyle =
            'rgba(143, 255, 234, 0.22)';

        context.fillRect(
            this.x - 12,
            this.y - 12,
            this.width + 24,
            this.height + 24
        );
    }

    /** Draws the goal frame. */
    drawGoalFrame(context) {
        context.strokeStyle =
            this.fallbackColor;
        context.lineWidth = 5;

        context.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    /** Draws the goal center. */
    drawGoalCenter(context) {
        context.fillStyle =
            'rgba(143, 255, 234, 0.18)';

        context.fillRect(
            this.x + 14,
            this.y + 14,
            this.width - 28,
            this.height - 28
        );
    }

    /** Draws a lock over a disabled finish. */
    drawLock(context) {
        const centerX =
            this.x + this.width / 2;
        const centerY =
            this.y + this.height / 2;

        context.strokeStyle = '#ffffff';
        context.lineWidth = 5;
        context.beginPath();

        context.arc(
            centerX,
            centerY - 12,
            15,
            Math.PI,
            0
        );

        context.stroke();
        context.fillStyle = '#ffffff';

        context.fillRect(
            centerX - 20,
            centerY - 12,
            40,
            34
        );
    }
}