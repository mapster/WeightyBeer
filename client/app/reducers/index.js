import {combineReducers} from 'redux';
import navigation from './navigation';
import taps from './taps';
import weights from './weights';
import brews from './brews';

export default combineReducers({
  brews, navigation, taps, weights
});
