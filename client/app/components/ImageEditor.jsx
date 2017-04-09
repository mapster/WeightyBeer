import React, {PropTypes} from 'react';
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

    // Initial state
    this.state = {
      canvas: new EditorCanvas({
        canvas: this.refs.canvas,
        imgSrc: props.imgSrc,
        mode: MODE.move,
        width: 500,
        height: 350,
        targetWidth: 332,
        targetHeight: 230,
      }),
    };
  }

  componentDidMount() {
    this.setState({canvas: EditorCanvas.merge(this.state.canvas, {canvas: this.refs.canvas})});
  }

  componentDidUpdate() {
    this.state.canvas.draw();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({canvas: EditorCanvas.merge(this.state.canvas, {imgSrc: nextProps.imgSrc})});
  }

  setMode(mode) {
    this.setState({canvas: EditorCanvas.merge(this.state.canvas, {mode})});
  }

  openImage(e) {
    let file = e.target.files[0];

    if (file) {
      const imgSrc = new Image();

      let reader = new FileReader();
      reader.addEventListener('load', () => {
        imgSrc.src = reader.result;
      }, false);

      reader.readAsDataURL(file);
      this.setState({canvas: EditorCanvas.merge(this.state.canvas, {imgSrc})});
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.setMode.bind(this, MODE.scale)}>Scale</button>
        <button onClick={this.setMode.bind(this, MODE.move)}>Move</button>
        <input type='file' onChange={this.openImage.bind(this)} />
        <canvas ref='canvas' width={canvasDim.width} height={canvasDim.height}></canvas>
      </div>
    );
  }
}

ImageEditor.propTypes = {
  imgSrc: PropTypes.any.isRequired,
};

export default ImageEditor;
