export default class Handle {

  constructor(centerX, centerY, size = 10) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.size = size;
  }

  getStartX() {
    return this.centerX - (this.size / 2);
  }

  getStartY() {
    return this.centerY - (this.size / 2);
  }

  getEndX() {
    return this.centerX + (this.size / 2);
  }

  getEndY() {
    return this.centerY + (this.size / 2);
  }

  canGrab(x, y) {
    return  x >= this.getStartX() &&
            x <= this.getEndX() &&
            y >= this.getStartY() &&
            y <= this.getEndY();
  }

  draw(ctx) {
    ctx.strokeRect(this.getStartX(), this.getStartY(), this.size, this.size);
  }
}
