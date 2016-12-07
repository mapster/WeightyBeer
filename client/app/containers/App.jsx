import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import ApplicationLayout from '../components/ApplicationLayout';
import BrewEditContainer from './BrewEditContainer';
import BrewsListContainer from './BrewsListContainer';

class App extends React.Component {
  render() {
    const {navigation, state} = this.props;

    return (
      <ApplicationLayout locationName={navigation.location.name}>
        {route(navigation.location, state)}
      </ApplicationLayout>
    );
  }
}

App.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  state: React.PropTypes.object.isRequired,
};

const route = (location, state) => {
  switch (location.name) {
    case 'home':
      return <h1>home</h1>;
    case 'taps':
      return <h1>taps</h1>;
    case 'brews':
      return <BrewsListContainer brews={state.brews} />;
    case 'brewEdit':
      return <BrewEditContainer brews={state.brews} id={location.options.id} />;
    default:
      return <div>Not found</div>;
  }
};

export default compose(
  connect(state => ({
    state: state,
    navigation: state.navigation,
  }), {
  })
)(App);
