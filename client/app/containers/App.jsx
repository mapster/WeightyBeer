import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import ApplicationLayout from '../components/ApplicationLayout';
import HomeContainer from './HomeContainer';
import TapsContainer from './TapsContainer';
import TapEditContainer from './TapEditContainer';
import BrewEditContainer from './BrewEditContainer';
import BrewsListContainer from './BrewsListContainer';
import WeightHubContainer from './WeightHubContainer';
import NotificationBar from '../components/NotificationBar';
import ImageEditor from './ImageEditor';

import {clearNotification} from '../actions/notification';

class App extends React.Component {
  render() {
    const {doClearNotification, navigation, notification} = this.props;

    return (
      <ApplicationLayout locationName={navigation.location.name}>
        {route(navigation.location)}
        <NotificationBar notification={notification} onNotifyDone={doClearNotification} />
      </ApplicationLayout>
    );
  }
}

App.propTypes = {
  doClearNotification: React.PropTypes.func.isRequired,
  navigation: React.PropTypes.object.isRequired,
  notification: React.PropTypes.object.isRequired,
};

const route2 = {
  home: <HomeContainer />,
  taps: <TapsContainer />,
  tapEdit: <TapEditContainer />,
  brews: <BrewsListContainer />,
  brewEdit: <BrewEditContainer />,
  weighthub: <WeightHubContainer />,
  image: <ImageEditor />,
}

const route = (location) => {
  return route2[location.name] || <div>Not found</div>;
};

export default compose(
  connect(state => ({
    navigation: state.navigation,
    notification: state.notification
  }), {
    doClearNotification: clearNotification
  })
)(App);
