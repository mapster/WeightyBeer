import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import EditorCanvas from '../model/EditorCanvas';

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
      mode: MODE.move,
    };

    // Draw image on load
    img.onload = () => {
      this.setState({canvas: new EditorCanvas(this.refs.canvas, img, 500, 350, 332, 230)});
    };
  }

  componentDidUpdate() {
    var canvas = this.state.canvas;
    canvas.mode = this.state.mode;
    canvas.draw();
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
