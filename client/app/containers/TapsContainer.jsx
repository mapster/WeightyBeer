import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
// import TapsList from '../components/TapsList';

class TapsContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Taps</h1>
      </div>
    );
  }
}

TapsContainer.propTypes = {
};

export default compose(
  connect(state => ({
  }), {
  })
)(TapsContainer);
