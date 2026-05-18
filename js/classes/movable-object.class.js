'use strict';

class MovableObject extends DrawableObject {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(x, y, width, height);
        this.speed = 0;
        this.direction = 1;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updatePosition() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    moveLeft() {
        this.velocityX = -this.speed;
        this.direction = -1;
    }

    moveRight() {
        this.velocityX = this.speed;
        this.direction = 1;
    }

    moveUp() {
        this.velocityY = -this.speed;
    }

    moveDown() {
        this.velocityY = this.speed;
    }

    keepInsideBounds(bounds) {
        this.keepInsideHorizontalBounds(bounds);
        this.keepInsideVerticalBounds(bounds);
    }

    keepInsideHorizontalBounds(bounds) {
        this.x = Math.max(bounds.left, this.x);
        this.x = Math.min(bounds.right - this.width, this.x);
    }

    keepInsideVerticalBounds(bounds) {
        this.y = Math.max(bounds.top, this.y);
        this.y = Math.min(bounds.bottom - this.height, this.y);
    }

    getRightSide() {
        return this.x + this.width;
    }

    getBottomSide() {
        return this.y + this.height;
    }

    isCollidingWith(object) {
        return this.getRightSide() > object.x &&
            this.x < object.getRightSide() &&
            this.getBottomSide() > object.y &&
            this.y < object.getBottomSide();
    }
}