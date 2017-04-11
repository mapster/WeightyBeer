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

  hasContent() {
    return this.imgSrc.complete;
  }

  draw(ctx) {
    if (this.imgSrc.complete) {
      ctx.drawImage(this.imgSrc, this.x, this.y, this.width, this.height);
    }
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  resize(horizontal, vertical, handle, keepRatio = false) {
    let flipped = flipByHandle(handle, horizontal, vertical);
    let width = flipped.x;
    let height = flipped.y;

    if (keepRatio) {
      if (Math.abs(width / this.ratio) > Math.abs(height)) {
        height = (width / this.ratio);
      } else {
        width = (height * this.ratio);
      }
    }
    this.width += width;
    this.height += height;

    // Move according to handle
    switch (handle) {
      case 'topLeft':
        this.move(-width, -height);
        break;
      case 'topRight':
        this.move(0, -height);
        break;
      case 'bottomLeft':
        this.move(-width, 0);
        break;
    }
  }

  drawHandleFrame(ctx) {
    ctx.strokeStyle = this.frameStyle;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.getHandles().forEach(h => h.draw(ctx));
  }
}

function flipByHandle(handle, x, y) {
  switch (handle) {
    case 'topLeft':
      return {x: -x, y: -y};
    case 'topRight':
      return {x, y: -y};
    case 'bottomRight':
      return {x, y};
    case 'bottomLeft':
      return {x: -x, y};
  }
}
