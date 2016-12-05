import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import Link from '../components/Link';

class App extends React.Component {
  render() {
    const {location} = this.props.navigation;
    switch (location.name) {
      case 'test':
        return <div>testing <Link name='root'>go to root</Link></div>;
      default:
        return <div>at root: <Link name='test'>go to test</Link></div>;
    }
  }
}

App.propTypes = {
  navigation: React.PropTypes.object
};

export default compose(
  connect(state => ({
    navigation: state.navigation
  }), {
  })
)(App);
