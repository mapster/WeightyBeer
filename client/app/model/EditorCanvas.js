import EditorImage from './EditorImage';

const MODE = {
  scale: 'scale',
  move: 'move',
};

export default class EditorCanvas {
  constructor(state) {
    let {canvas, width, height, targetWidth, targetHeight} = state;
    let imgSrc = state.imgSrc || {complete: false};
    let internal = {
      image: new EditorImage(imgSrc, (width - targetWidth) / 2, (height - targetHeight) / 2, targetWidth, targetHeight),
      drag: {is: false},
      grab: {is: false},
      ...state,
    };

    this.getInternal = () => internal;
    this.setDrag = (drag) => {internal.drag = drag};
    this.setGrab = (grab) => {internal.grab = grab};

    if (canvas) {
      internal.context = canvas.getContext('2d');
      this.bindCanvasEventListeners();
    }
    imgSrc.onload = () => this.draw();
  }

  static merge(prev, updates = {}) {
    let newState = {...prev.getInternal(), ...updates};
    if (updates.imgSrc) {
      delete newState.image;
    }
    return new EditorCanvas(newState);
  }

  draw() {
    const {context, image, mode, width, height} = this.getInternal();

    if (context) {
      context.clearRect(0,0, width, height);
      image.draw(context);
      this.drawFrame();
      if (mode == MODE.scale) {
        this.drawScaleFrame();
      }
    }
  }

  drawFrame() {
    const {width, height, targetWidth, targetHeight, context} = this.getInternal();
    const vertical = {
      width: (width - targetWidth) / 2,
      height: targetHeight,
    };
    const horizontal = {
      width: width,
      height: (height - targetHeight) / 2,
    }
    context.fillStyle = 'rgba(33, 33, 33, 0.65)';
    // Draw top
    context.fillRect(0, 0, horizontal.width, horizontal.height);
    // Draw bottom
    context.fillRect(0, horizontal.height + vertical.height, horizontal.width, horizontal.height);
    // Draw left
    context.fillRect(0, horizontal.height, vertical.width, vertical.height);
    // Draw right
    context.fillRect(width - vertical.width, horizontal.height, vertical.width, vertical.height);
  }

  drawScaleFrame() {
    const {image, context} = this.getInternal();
    image.drawHandleFrame(context);
  }

  bindCanvasEventListeners() {
    const {canvas, mode} = this.getInternal();
    if (!canvas) {
      return;
    }

    if (mode == MODE.move) {
      // Set mouse event listeners for canvas
      canvas.onmousedown = (e) => {
        this.setDrag({x: e.x, y: e.y, is: true});
      };
      canvas.onmouseup = () => {
        this.setDrag({is: false});
      };
      canvas.onmousemove = (e) => {
        const {drag, image} = this.getInternal();
        const {x, y} = e;
        if (drag.is) {
          image.move(x - drag.x, y - drag.y);
          this.draw();
          this.setDrag({x, y, is: true});
        }
      };
    } else if (mode == MODE.scale) {
      canvas.onmousedown = (e) => {
        const {image} = this.getInternal();
        let mousePos = this.getMousePos(e);
        let handle = image.getGrabbableHandle(mousePos.x, mousePos.y);
        if (handle) {
          this.setGrab({
            handle: handle,
            is: true,
            x: e.x,
            y: e.y,
          });
        }
      };
      canvas.onmouseup = () => {
        this.setGrab({is: false});
      };
      canvas.onmousemove = (e) => {
        const {grab} = this.getInternal();
        if (grab.is) {
          const {grab, image} = this.getInternal();
          const {x, y} = e;
          image.resize(x - grab.x, y - grab.y, grab.handle, true);
          this.draw();
          this.setGrab({...grab, x, y});
        }
      };
    }
  }

  getMousePos(e) {
    const {canvas} = this.getInternal();
    let rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }
}
