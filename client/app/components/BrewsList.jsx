import React, {PropTypes} from 'react';
import {GridList} from 'material-ui/GridList';
import BrewEntry from './BrewEntry';

const BrewsList = ({brews, images, doDeleteBrew, toEditBrew}) => (
  <GridList>{brews.sort((a, b) => a.brewNo - b.brewNo).map((b) =>
    <BrewEntry doDeleteBrew={() => doDeleteBrew(b.id)} toEditBrew={() => toEditBrew(b.id)} key={b.id} {...b} images={images} />
  )}</GridList>
);

BrewsList.propTypes = {
  brews: PropTypes.array.isRequired,
  images: PropTypes.object.isRequired,
  doDeleteBrew: PropTypes.func.isRequired,
  toEditBrew: PropTypes.func.isRequired,
};

export default BrewsList;
