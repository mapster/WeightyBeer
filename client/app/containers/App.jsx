import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import Taps from '../components/Taps';
import {addTap} from '../actions/taps';

class App extends React.Component {
  render() {
    const {taps, addTap} = this.props;

    return (
      <div>
        <h1>WeightyBeer settings</h1>
        <button className="add-tap"
          onClick={addTap.bind(null, {
            name: 'New tap'
          })}>+</button>
        <h2>Active taps</h2>
        <Taps taps={taps} />
      </div>
    );
  }
}

App.propTypes = {
  addTap: React.PropTypes.function,
  taps: React.PropTypes.array
};

export default compose(
  connect(state => ({
    taps: state.taps.active
  }), {
    addTap
  })
)(App);
