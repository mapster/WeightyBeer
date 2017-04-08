import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

// import Handle from '../model/handle';
import EditorImage from '../model/EditorImage';

const targetDim = {
  width: 332,
  height: 230
};

const canvasDim = {
  width: 500,
  height: 350,
};

const MODE = {
  scale: 'scale',
  move: 'move',
};

class ImageEditor extends React.Component {
  constructor(props) {
    super(props);

    // Load image
    const img = new Image();
    img.src = 'https://firebasestorage.googleapis.com/v0/b/weightybeer.appspot.com/o/app%2Fimages%2F1a1d12eb-3bee-4432-90e0-c9549690ab2a?alt=media&token=c6f7bfb1-9ba7-43c6-b349-9fd308ec145b';

    // Initial state
    this.state = {
      image: new EditorImage(img, (canvasDim.width - targetDim.width) / 2, (canvasDim.height - targetDim.height) / 2, targetDim.width, targetDim.height),
      mode: MODE.move,
    };

    // Draw image on load
    img.onload = () => {
      this.updateCanvas();
    };
  }

  componentDidMount() {
    this.bindCanvasEventListeners();
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  bindCanvasEventListeners() {
    const canvas = this.refs.canvas;
    const {mode, drag} = this.state;

    if (mode == MODE.move) {
      // Set mouse event listeners for canvas
      canvas.onmousedown = (e) => {
        this.setState({
          drag: {x: e.x, y: e.y}
        });
      };
      canvas.onmouseup = (e) => {
        if (drag) {
          this.moveImage(e.x - drag.x , e.y - drag.y);
        }
        this.setState({drag: null});
        this.updateCanvas();
      };
      canvas.onmousemove = (e) => {
        if (drag) {
          this.setState({
            drag: {x: e.x, y: e.y}
          });
          this.moveImage(e.x - drag.x, e.y - drag.y);
        }
      };
    } else if (mode == MODE.scale) {
      canvas.onmousedown = () => {
        // if (this.isNearHandle(e.x, e.y)) {
        //
        // }
      };
      canvas.onmouseup = () => {};
      canvas.onmousemove = () => {};
    }
  }

  drawFrame() {
    const ctx = this.refs.canvas.getContext('2d');
    const vertical = {
      width: (canvasDim.width - targetDim.width) / 2,
      height: targetDim.height,
    };
    const horizontal = {
      width: canvasDim.width,
      height: (canvasDim.height - targetDim.height) / 2,
    }
    ctx.fillStyle = 'rgba(33, 33, 33, 0.65)';
    // Draw top
    ctx.fillRect(0, 0, horizontal.width, horizontal.height);
    // Draw bottom
    ctx.fillRect(0, horizontal.height + vertical.height, horizontal.width, horizontal.height);
    // Draw left
    ctx.fillRect(0, horizontal.height, vertical.width, vertical.height);
    // Draw right
    ctx.fillRect(canvasDim.width - vertical.width, horizontal.height, vertical.width, vertical.height);
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    const {image, mode} = this.state;
    ctx.clearRect(0,0, canvasDim.width, canvasDim.height);
    image.draw(ctx);
    this.drawFrame();
    if (mode == MODE.scale) {
      this.drawScaleFrame();
    }
  }

  drawScaleFrame() {
    const ctx = this.refs.canvas.getContext('2d');
    this.state.image.drawHandleFrame(ctx);
  }

  moveImage(x, y) {
    this.state.image.move(x, y);
    this.updateCanvas();
  }

  setMode(mode) {
    this.setState({mode});
  }

  render() {
    return (
      <div>
        <button onClick={this.setMode.bind(this, MODE.scale)}>Scale</button>
        <button onClick={this.setMode.bind(this, MODE.move)}>Move</button>
        <canvas ref='canvas' width={canvasDim.width} height={canvasDim.height}></canvas>
      </div>
    );
  }
}

export default compose(
  connect(() => ({
  }), {
  })
)(ImageEditor);
