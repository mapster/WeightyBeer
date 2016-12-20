import React, {PropTypes} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';

const fileInputStyle = {
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  opacity: 0,
};
const gridListStyle = {
  display: 'flex',
  flexWrap: 'noWrap',
  overflowX: 'auto',
};

const ImageChooser = ({doSelectImage, doUploadImage, images}) => (
  <div>
    <GridList style={gridListStyle} cols={2.2}>{images.map(img =>
      <GridTile onClick={() => doSelectImage(img.id)} key={img.id}>
        <img src={img.url} />
      </GridTile>
    )}</GridList>
    <RaisedButton containerElement='label' label='Choose image' labelPosition='before'>
      <input type='file' style={fileInputStyle} onChange={(e) => doUploadImage(e.target.files[0])} />
    </RaisedButton>
  </div>
);

ImageChooser.propTypes = {
  doSelectImage: PropTypes.func.isRequired,
  doUploadImage: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
}

export default ImageChooser;
