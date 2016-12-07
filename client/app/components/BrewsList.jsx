import React from 'react';
import {GridList} from 'material-ui/GridList';
import BrewEntry from './BrewEntry';

const BrewsList = ({brews}) => (
  <GridList>{brews.sort((a, b) => a.brew - b.brew).map((b) =>
    <BrewEntry key={b.brew} brew={b.brew} name={b.name} style={b.style} />
  )}</GridList>
);

BrewsList.propTypes = {
  brews: React.PropTypes.array.isRequired,
};

export default BrewsList;
