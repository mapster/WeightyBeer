import React from 'react';
import {Provider} from 'react-redux';
import App from './App';
import DevTools from './DevTools';

export default ({store}) =>
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>
