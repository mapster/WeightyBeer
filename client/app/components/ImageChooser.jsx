import React, {PropTypes} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Favorite from 'material-ui/svg-icons/action/favorite';

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
// (img.id == selectedId && <Favorite />) ||
 // onClick={() => doSelectImage(img.id)}
const ImageChooser = ({doSelectImage, doUploadImage, images, selectedId}) => (
  <div>
    <GridList style={gridListStyle} cols={2.2}>{images.map(img =>
      <GridTile
        actionIcon={
          <IconButton>
            <FavoriteBorder />
          </IconButton>
        }
        key={img.id}
        >
        <img src={img.url} />
      </GridTile>
    )}</GridList>
    <RaisedButton containerElement='label' label='Upload image' labelPosition='before'>
      <input type='file' style={fileInputStyle} onChange={(e) => doUploadImage(e.target.files[0])} />
    </RaisedButton>
  </div>
);

ImageChooser.propTypes = {
  doSelectImage: PropTypes.func.isRequired,
  doUploadImage: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
}

export default ImageChooser;
