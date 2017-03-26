import {database} from '../libs/FirebaseApp';
import {notify} from './notification';

var weightsRef = database.ref('weighthub/weights');
var actionsRef = database.ref('weighthub/actions');

export const RECEIVE_WEIGHTS_DATA = 'RECEIVE_WEIGHTS_DATA';
export function startListeningToWeightHub() {
  return (dispatch) => {
    weightsRef.on('value', (snapshot) => {
      dispatch({
        type: RECEIVE_WEIGHTS_DATA,
        data: snapshot.val()
      });
    });
  }
}

export function calibrateWeight(id, target) {
  return (dispatch) => {
    dispatch(notify('Setting tap "' + id + '" as "' + target + '"'));
    actionsRef.push({
      type: 'calibrate',
      target,
      id,
    });
  }
}
