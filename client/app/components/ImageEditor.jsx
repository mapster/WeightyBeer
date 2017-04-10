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
        targetWidth: props.targetWidth,
        targetHeight: props.targetHeight,
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

  saveImage() {
    const {canvas} = this.state;
    const {saveCanvas} = this.refs;

    canvas.targetToBlob(saveCanvas.getContext('2d'), this.props.saveImage);
  }

  render() {
    return (
      <div>
        <button onClick={this.saveImage.bind(this)}>Save</button>
        <button onClick={this.setMode.bind(this, MODE.scale)}>Scale</button>
        <button onClick={this.setMode.bind(this, MODE.move)}>Move</button>
        <input type='file' onChange={this.openImage.bind(this)} />
        <canvas ref='canvas' width={canvasDim.width} height={canvasDim.height}></canvas>
        <canvas ref='saveCanvas' width={this.props.targetWidth} height={this.props.targetHeight}></canvas>
      </div>
    );
  }
}

ImageEditor.propTypes = {
  targetWidth: PropTypes.number.isRequired,
  targetHeight: PropTypes.number.isRequired,
  imgSrc: PropTypes.any.isRequired,
  saveImage: PropTypes.func.isRequired,
};

export default ImageEditor;
