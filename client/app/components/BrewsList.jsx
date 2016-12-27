import React from 'react';
import {GridList} from 'material-ui/GridList';
import BrewEntry from './BrewEntry';

const BrewsList = ({brews, images}) => (
  <GridList>{brews.sort((a, b) => a.brewNo - b.brewNo).map((b) =>
    <BrewEntry key={b.id} {...b} images={images} />
  )}</GridList>
);

BrewsList.propTypes = {
  brews: React.PropTypes.array.isRequired,
  images: React.PropTypes.object.isRequired,
};

export default BrewsList;
