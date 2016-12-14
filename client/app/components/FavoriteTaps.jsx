import React, {PropTypes} from 'react';
import {GridList} from 'material-ui/GridList';
import TapCard from './TapCard';

const FavoriteTaps = ({taps, brews, weights}) => (
  <GridList cols={3}>{taps.filter(tap => tap.isActive).map((tap) =>
    <TapCard key={tap.id} tap={tap} brew={brews[tap.brew]} weight={weights[tap.weight]} />
  )}</GridList>
);

FavoriteTaps.propTypes = {
  taps: PropTypes.array.isRequired,
  brews: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
};

export default FavoriteTaps;
