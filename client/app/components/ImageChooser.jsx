import React, {PropTypes} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Favorite from 'material-ui/svg-icons/action/favorite';
import Delete from 'material-ui/svg-icons/action/delete';

const ImageChooser = ({doSelectImage, doDeleteImage, images, selectedId}) => (
  <div className='imageChooser'>
    <GridList className='gridList' cols={2.2}>{images.map(img =>
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
  </div>
);

ImageChooser.propTypes = {
  doSelectImage: PropTypes.func.isRequired,
  doDeleteImage: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
}

export default ImageChooser;
