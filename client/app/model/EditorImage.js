import Handle from './Handle';

const FRAME_STYLE = 'rgb(255, 64, 129)';

export default class EditorImage {
  constructor(imgSrc, x, y, width, height, frameStyle = FRAME_STYLE) {
    this.imgSrc = imgSrc;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ratio = width / height;
    this.frameStyle = frameStyle;
  }

  handles() {
    return {
      topLeft: new Handle(this.x, this.y),
      topRight: new Handle(this.x + this.width, this.y),
      bottomRight: new Handle(this.x + this.width, this.y + this.height),
      bottomLeft: new Handle(this.x, this.y + this.height)
    };
  }

  getHandles() {
    return Object.entries(this.handles()).map(e => e[1]);
  }

  getGrabbableHandle(x, y) {
    let handle = Object.entries(this.handles()).find(e => e[1].canGrab(x, y));
    return handle && handle[0];
  }

  draw(ctx) {
    ctx.drawImage(this.imgSrc, this.x, this.y, this.width, this.height);
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  resize(x, y, handle, keepRatio = false) {
    let resize = {x, y};
    if (keepRatio) {
      if (Math.abs(x / this.ratio) > Math.abs(y)) {
        resize.y = (x / this.ratio);
      } else {
        resize.x = (y * this.ratio);
      }
    }
    switch (handle) {
      case 'topLeft':
        resize.x = -resize.x;
        resize.y = -resize.y;
        break;
      case 'topRight':
        resize.y = -resize.y;
        break;
      case 'bottomLeft':
        resize.x = -resize.x;
        break;
    }
    this.width += resize.x;
    this.height += resize.y;
  }

  drawHandleFrame(ctx) {
    ctx.strokeStyle = this.frameStyle;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.getHandles().forEach(h => h.draw(ctx));
  }
}
