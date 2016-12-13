import React, {PropTypes} from 'react';
import TapCard from './TapCard';

const FavoriteTaps = ({taps, brews, weights}) => (
  <div>{taps.filter(tap => tap.isActive).map((tap) =>
    <TapCard key={tap.id} tap={tap} brew={brews[tap.brew]} weight={weights[tap.weight]} />
  )}</div>
);

FavoriteTaps.propTypes = {
  taps: PropTypes.array.isRequired,
  brews: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
};

export default FavoriteTaps;
