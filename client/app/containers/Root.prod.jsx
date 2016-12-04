import React from 'react';
import {Provider} from 'react-redux';
import App from './App';

export default class RootDev extends React.Component {
  render() {
    const {store} = this.props;

    return (
      <Provider store={store}>
          <App />
      </Provider>
    );
  }
}
RootDev.propTypes = {
    store: React.PropTypes.object
};
