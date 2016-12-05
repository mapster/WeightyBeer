import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';
import configureStore from './store/configureStore';
import storage from './libs/storage';
import {navigationComplete} from './actions/navigation';
import {startListeningToWeightHub} from './actions/weights';

const APP_STORAGE = 'weighty_beer'

const store = configureStore(storage.get(APP_STORAGE) || {});

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
});

window.addEventListener('hashchange', () => store.dispatch(navigationComplete()), false);
