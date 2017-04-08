import Handle from './Handle';

const FRAME_STYLE = 'rgb(255, 64, 129)';

export default class EditorImage {
  constructor(imgSrc, x, y, width, height, frameStyle = FRAME_STYLE) {
    this.imgSrc = imgSrc;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameStyle = frameStyle;
  }

  getHandles() {
    return [
      new Handle(this.x, this.y),
      new Handle(this.x + this.width, this.y),
      new Handle(this.x + this.width, this.y + this.height),
      new Handle(this.x, this.y + this.height)
    ];
  }

  draw(ctx) {
    ctx.drawImage(this.imgSrc, this.x, this.y, this.width, this.height);
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  drawHandleFrame(ctx) {
    ctx.strokeStyle = this.frameStyle;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.getHandles().forEach(h => h.draw(ctx));
  }
}
