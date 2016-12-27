import React, {PropTypes} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Favorite from 'material-ui/svg-icons/action/favorite';
import Delete from 'material-ui/svg-icons/action/delete';

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

const ImageChooser = ({doSelectImage, doDeleteImage, doUploadImage, images, selectedId}) => (
  <div>
    <GridList style={gridListStyle} cols={2.2}>{images.map(img =>
      <GridTile
        actionIcon={
          <div>
            <IconButton onClick={() => doDeleteImage(img.id)}>
              <Delete />
            </IconButton>
            <IconButton onClick={() => doSelectImage(img.id)}>
              { img.id == selectedId && <Favorite /> || <FavoriteBorder /> }
            </IconButton>
        </div>
        }
        key={img.id}
        title=' '
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
  doDeleteImage: PropTypes.func.isRequired,
  doUploadImage: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
}

export default ImageChooser;
