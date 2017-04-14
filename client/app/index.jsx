import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import firebase from 'firebase';

import Root from './containers/Root';
import configureStore from './store/configureStore';
import storage from './libs/storage';
import {navigationComplete} from './actions/navigation';
import {startListeningToWeightHub} from './actions/weights';
import {startListeningToBrewsData} from './actions/brews';
import {startListeningToTapsData} from './actions/taps';
import {startListeningToImagesData} from './actions/images';

// Authentication
const auth = firebase.auth();
auth.onAuthStateChanged(user => {
  if (!user) {
    auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  } else {
    console.log('Logged in as "%s"', user.email);
  }
});

injectTapEventPlugin();

// Configure Store and Root component
const store = configureStore(storage.get('weighty_beer') || {});
if (!store.getState().navigation.transitioning) {
  if (!store.getState().navigation.transitioning) {
    ReactDOM.render(
      <Root store={store} />,
      document.getElementById('app')
    );
  }
}

// Setup database connections
setTimeout(() => {
  store.dispatch(startListeningToBrewsData());
  store.dispatch(startListeningToWeightHub());
  store.dispatch(startListeningToTapsData());
  store.dispatch(startListeningToImagesData());
});

// Setup hash (#) navigation
const onHashChange = () => {
  store.dispatch(navigationComplete());
}
window.addEventListener('hashchange', onHashChange , false);
onHashChange();
