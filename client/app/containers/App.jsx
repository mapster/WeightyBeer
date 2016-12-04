import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import Taps from '../components/Taps';
import {addTap} from '../actions/settings';

class App extends React.Component {
  render() {
    const {taps, addTap} = this.props;

    return (
      <div>
        <h1>App er her!</h1>
        <button className="add-tap"
          onClick={addTap.bind(null, {
            name: 'New tap'
          })}>+</button>
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
    taps: state.settings
  }), {
    addTap
  })
)(App);
