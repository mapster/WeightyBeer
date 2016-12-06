import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Root from './containers/Root';
import configureStore from './store/configureStore';
import storage from './libs/storage';
import {navigationComplete} from './actions/navigation';
import {startListeningToWeightHub} from './actions/weights';
import {startListeningToAppData} from './actions/brews';

const APP_STORAGE = 'weighty_beer'

const store = configureStore(storage.get(APP_STORAGE) || {});
injectTapEventPlugin();

store.subscribe(() => {
  if (!storage.get('debug')) {
    storage.set(APP_STORAGE, store.getState());
  }
});

if (!store.getState().navigation.transitioning) {
  ReactDOM.render(
    <Root store={store} />,
    document.getElementById('app')
  );
}

setTimeout(() => {
  store.dispatch(startListeningToWeightHub());
  store.dispatch(startListeningToAppData());
});

window.addEventListener('hashchange', () => store.dispatch(navigationComplete()), false);
