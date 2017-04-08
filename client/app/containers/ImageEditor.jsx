import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

const targetDim = {
  width: 332,
  height: 230
};

const canvasDim = {
  width: 500,
  height: 350,
};

const drawFrame = (ctx) => {
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
};

class ImageEditor extends React.Component {
  constructor(props) {
      super(props);

      // Load image
      const img = new Image();
      img.src = 'https://firebasestorage.googleapis.com/v0/b/weightybeer.appspot.com/o/app%2Fimages%2F1a1d12eb-3bee-4432-90e0-c9549690ab2a?alt=media&token=c6f7bfb1-9ba7-43c6-b349-9fd308ec145b';

      // Initial state
      this.state = {
        img: img,
        pos: {
          x: (canvasDim.width - targetDim.width) / 2,
          y: (canvasDim.height - targetDim.height) / 2,
          width: targetDim.width,
          height: targetDim.height,
        },
      };

      // Draw image on load
      img.onload = () => {
        this.updateCanvas();
      };
  }

  componentDidMount() {
    this.updateCanvas();
    // Set mouse event listeners for canvas
    const canvas = this.refs.canvas;
    canvas.onmousedown = (e) => {
      this.setState({
        drag: {x: e.x, y: e.y}
      });
    };
    canvas.onmouseup = (e) => {
      const drag = this.state.drag;
      if (drag) {
        this.moveImage(e.x - drag.x , e.y - drag.y);
      }
      this.setState({drag: null});
      this.updateCanvas();
    }
    canvas.onmousemove = (e) => {
      const drag = this.state.drag;
      if (drag) {
        this.setState({
          drag: {x: e.x, y: e.y}
        });
        this.moveImage(e.x - drag.x, e.y - drag.y);
      }
    };
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    const {img, pos} = this.state;
    ctx.clearRect(0,0, canvasDim.width, canvasDim.height);

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.drawImage(img, 0, 0, pos.width, pos.height);
    ctx.restore();

    drawFrame(ctx);
  }

  moveImage(x, y) {
    const pos = this.state.pos;
    this.setState({
      pos: {...pos, x: pos.x + x, y: pos.y + y}
    });
    this.updateCanvas();
  }

  render() {
    return (
      <div>
        <canvas ref='canvas' width={canvasDim.width} height={canvasDim.height}></canvas>
      </div>
    );
  }
}

export default compose(
  connect(state => ({
  }), {
  })
)(ImageEditor);
