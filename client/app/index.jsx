import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Root from './containers/Root';
import configureStore from './store/configureStore';
import storage from './libs/storage';
import {navigationComplete} from './actions/navigation';
import {startListeningToWeightHub} from './actions/weights';
import {startListeningToBrewsData} from './actions/brews';
import {startListeningToTapsData} from './actions/taps';
import {startListeningToImagesData} from './actions/images';

const APP_STORAGE = 'weighty_beer';

const store = configureStore(storage.get(APP_STORAGE) || {});
injectTapEventPlugin();

if (!store.getState().navigation.transitioning) {
  if (!store.getState().navigation.transitioning) {
    ReactDOM.render(
      <Root store={store} />,
      document.getElementById('app')
    );
  }
}

setTimeout(() => {
  store.dispatch(startListeningToBrewsData());
  store.dispatch(startListeningToWeightHub());
  store.dispatch(startListeningToTapsData());
  store.dispatch(startListeningToImagesData());
});

function onHashChange() {
  store.dispatch(navigationComplete());
}
window.addEventListener('hashchange', onHashChange , false);
onHashChange();
