import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import ApplicationLayout from '../components/ApplicationLayout';
import BrewEditContainer from './BrewEditContainer';
import BrewsListContainer from './BrewsListContainer';
import WeightHubContainer from './WeightHubContainer';

class App extends React.Component {
  render() {
    const {navigation} = this.props;

    return (
      <ApplicationLayout locationName={navigation.location.name}>
        {route(navigation.location)}
      </ApplicationLayout>
    );
  }
}

App.propTypes = {
  navigation: React.PropTypes.object.isRequired,
};

const route2 = {
  home: <h1>home</h1>,
  taps: <h1>taps</h1>,
  brews: <BrewsListContainer />,
  brewEdit: <BrewEditContainer />,
  weighthub: <WeightHubContainer />,
}

const route = (location) => {
  return route2[location.name] || <div>Not found</div>;
};

export default compose(
  connect(state => ({
    navigation: state.navigation,
  }), {
  })
)(App);
