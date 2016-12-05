import {combineReducers} from 'redux';
import navigation from './navigation';
import taps from './taps';
import weights from './weights';

export default combineReducers({
  navigation, taps, weights
});
