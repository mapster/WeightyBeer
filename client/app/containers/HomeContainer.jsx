import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import FavoriteTaps from '../components/FavoriteTaps';

class HomeContainer extends React.Component {
  render() {
    const {taps, brews, images, weights} = this.props;
    return (
      <div className='homeContainer'>
        <FavoriteTaps taps={Object.entries(taps).map(e => e[1])} brews={brews} images={images} weights={weights} />
      </div>
    );
  }
}

HomeContainer.propTypes = {
  taps: PropTypes.object.isRequired,
  brews: PropTypes.object.isRequired,
  images: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({
    taps: state.taps.data,
    brews: state.brews.data,
    images: state.images.data,
    weights: state.weights.data,
  }), {
  })
)(HomeContainer);
