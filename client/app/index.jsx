import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {AppContainer} from 'react-hot-loader';

import Root from './containers/Root';
import configureStore from './store/configureStore';
import storage from './libs/storage';
import {navigationComplete} from './actions/navigation';
import {startListeningToWeightHub} from './actions/weights';
import {startListeningToBrewsData} from './actions/brews';

const APP_STORAGE = 'weighty_beer'

const store = configureStore(storage.get(APP_STORAGE) || {});
injectTapEventPlugin();

// store.subscribe(() => {
//   if (!storage.get('debug')) {
//     storage.set(APP_STORAGE, store.getState());
//   }
// });

if (!store.getState().navigation.transitioning) {
  if (!store.getState().navigation.transitioning) {
    ReactDOM.render(
      <AppContainer><Root store={store} /></AppContainer>,
      document.getElementById('app')
    );
  }
}

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NewRoot = require('./containers/Root').default;
    if (!store.getState().navigation.transitioning) {
      ReactDOM.render(
        <AppContainer><NewRoot store={store} /></AppContainer>,
        document.getElementById('app')
      );
    }
  });
}

setTimeout(() => {
  store.dispatch(startListeningToBrewsData());
  store.dispatch(startListeningToWeightHub());
});

function onHashChange() {
  store.dispatch(navigationComplete());
}
window.addEventListener('hashchange', onHashChange , false);
onHashChange();
