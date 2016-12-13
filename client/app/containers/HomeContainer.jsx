import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import FavoriteTaps from '../components/FavoriteTaps';
// import link from '../libs/link';

class HomeContainer extends React.Component {
  render() {
    const {taps, brews, weights} = this.props;
    return (
      <div>
        <FavoriteTaps taps={Object.entries(taps).map(e => e[1])} brews={brews} weights={weights} />
      </div>
    );
  }
}

HomeContainer.propTypes = {
  taps: PropTypes.object.isRequired,
  brews: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({
    taps: state.taps.data,
    brews: state.brews.data,
    weights: state.weights.data,
  }), {
  })
)(HomeContainer);
