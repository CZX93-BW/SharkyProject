'use strict';

class FinishObject extends DrawableObject {
    constructor(x, y) {
        super(
            x,
            y,
            GAME_CONFIG.finishObjectWidth,
            GAME_CONFIG.finishObjectHeight
        );

        this.fallbackColor = GAME_CONFIG.finishObjectFallbackColor;
        this.loadImage(ASSET_CONFIG.levelObjects.finish);
    }

    isReachedBy(player) {
        return player.getRightSide() > this.x &&
            player.x < this.getRightSide() &&
            player.getBottomSide() > this.y &&
            player.y < this.getBottomSide();
    }

    draw(context) {
        if (this.isImageReady()) {
            super.draw(context);
            return;
        }

        this.drawFallbackGoal(context);
    }

    drawFallbackGoal(context) {
        this.drawGoalGlow(context);
        this.drawGoalFrame(context);
        this.drawGoalCenter(context);
    }

    drawGoalGlow(context) {
        context.fillStyle = 'rgba(143, 255, 234, 0.22)';
        context.fillRect(this.x - 12, this.y - 12, this.width + 24, this.height + 24);
    }

    drawGoalFrame(context) {
        context.strokeStyle = this.fallbackColor;
        context.lineWidth = 5;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawGoalCenter(context) {
        context.fillStyle = 'rgba(143, 255, 234, 0.18)';
        context.fillRect(this.x + 14, this.y + 14, this.width - 28, this.height - 28);
    }
}