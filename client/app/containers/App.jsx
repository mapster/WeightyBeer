import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import ApplicationLayout from '../components/ApplicationLayout';
import BrewsListContainer from './BrewsListContainer';

class App extends React.Component {
  render() {
    const {navigation, brews} = this.props;

    return (
      <ApplicationLayout locationName={navigation.location.name}>
        {route(navigation.location, brews)}
      </ApplicationLayout>
    );
  }
}

App.propTypes = {
  navigation: React.PropTypes.object,
  brews: React.PropTypes.object,
};

const route = (location, brews) => {
  switch (location.name) {
    case 'home':
      return <h1>home</h1>;
    case 'taps':
      return <h1>taps</h1>;
    case 'brews':
      return <BrewsListContainer brews={brews} />;
    default:
      return <div>Not found</div>;
  }
};

export default compose(
  connect(state => ({
    brews: state.brews,
    navigation: state.navigation,
  }), {
  })
)(App);
