import React from 'react';
import {GridList} from 'material-ui/GridList';
import BrewEntry from './BrewEntry';

const BrewsList = ({brews}) => (
  <GridList>{brews.sort((a, b) => a.brewNo - b.brewNo).map((b) =>
    <BrewEntry key={b.id} {...b} />
  )}</GridList>
);

BrewsList.propTypes = {
  brews: React.PropTypes.array.isRequired,
};

export default BrewsList;
