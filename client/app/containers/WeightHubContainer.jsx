import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import WeightsList from '../components/WeightsList';
import {calibrateWeight} from '../actions/weights';

class WeightHubContainer extends React.Component {
  render() {
    const {weights, doCalibrate} = this.props;
    return (
      <div>
        <h1>WeightHub</h1>
        <WeightsList weights={Object.entries(weights).map(e => e[1])} doCalibrate={doCalibrate} />
      </div>
    );
  }
}

WeightHubContainer.propTypes = {
  weights: PropTypes.object.isRequired,
  doCalibrate: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    weights: state.weights.data,
  }), {
    doCalibrate: calibrateWeight,
  })
)(WeightHubContainer);
