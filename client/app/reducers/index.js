import {combineReducers} from 'redux';
import navigation from './navigation';
import images from './images';
import taps from './taps';
import weights from './weights';
import brews from './brews';

export default combineReducers({
  images, brews, navigation, taps, weights
});
