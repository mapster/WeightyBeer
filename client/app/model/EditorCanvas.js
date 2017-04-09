import EditorImage from './EditorImage';

const MODE = {
  scale: 'scale',
  move: 'move',
};

var drag = {
  x: 0,
  y: 0,
  is: false
};

var grab = {is: false};

var internal = {
  mode: MODE.move,
};

export default class EditorCanvas {
  constructor(canvas, imgSrc, width, height, targetWidth, targetHeight) {
    this.width = width;
    this.height = height;
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;

    this.canvas = canvas;
    this.image = new EditorImage(imgSrc, (width - targetWidth) / 2, (height - targetHeight) / 2, targetWidth, targetHeight);
    this.bindCanvasEventListeners(canvas);
  }

  set canvas(canvas) {
    internal.canvas = canvas;
    internal.context = canvas.getContext('2d');
  }
  get canvas() {
    return internal.canvas;
  }
  get context() {
    return internal.context;
  }
  set mode(mode) {
    this.doDrag(0, 0, false);
    internal.mode = mode;
    this.bindCanvasEventListeners();
  }
  get mode() {
    return internal.mode;
  }

  draw() {
    const ctx = this.context;

    ctx.clearRect(0,0, this.width, this.height);
    this.image.draw(ctx);
    this.drawFrame(ctx);
    if (this.mode == MODE.scale) {
      this.drawScaleFrame(ctx);
    }
  }

  drawFrame() {
    const vertical = {
      width: (this.width - this.targetWidth) / 2,
      height: this.targetHeight,
    };
    const horizontal = {
      width: this.width,
      height: (this.height - this.targetHeight) / 2,
    }
    const ctx = this.context;
    ctx.fillStyle = 'rgba(33, 33, 33, 0.65)';
    // Draw top
    ctx.fillRect(0, 0, horizontal.width, horizontal.height);
    // Draw bottom
    ctx.fillRect(0, horizontal.height + vertical.height, horizontal.width, horizontal.height);
    // Draw left
    ctx.fillRect(0, horizontal.height, vertical.width, vertical.height);
    // Draw right
    ctx.fillRect(this.width - vertical.width, horizontal.height, vertical.width, vertical.height);
  }

  drawScaleFrame() {
    this.image.drawHandleFrame(this.context);
  }

  doDrag(x, y, start = true) {
    drag = {x, y, is: start};
  }

  drag(x, y) {
    this.image.move(x - drag.x, y - drag.y);
    this.draw();
    drag = {x, y, is: true};
  }

  grab(x, y) {
    this.image.resize(x - grab.x, y - grab.y, grab.handle, true);
    this.draw();
    grab = {...grab, x, y};
  }

  bindCanvasEventListeners() {
    if (this.mode == MODE.move) {
      // Set mouse event listeners for canvas
      this.canvas.onmousedown = (e) => {
        this.doDrag(e.x, e.y);
      };
      this.canvas.onmouseup = () => {
        this.doDrag(0, 0, false);
      };
      this.canvas.onmousemove = (e) => {
        if (drag.is) {
          this.drag(e.x, e.y);
        }
      };
    } else if (this.mode == MODE.scale) {
      this.canvas.onmousedown = (e) => {
        let mousePos = this.getMousePos(e);
        let handle = this.image.getGrabbableHandle(mousePos.x, mousePos.y);
        if (handle) {
          grab = {
            handle: handle,
            is: true,
            x: e.x,
            y: e.y,
          };
        }
      };
      this.canvas.onmouseup = () => {
        grab = {is: false};
      };
      this.canvas.onmousemove = (e) => {
        if (grab.is) {
          this.grab(e.x, e.y);
        }
      };
    }
  }

  getMousePos(e) {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }
}
