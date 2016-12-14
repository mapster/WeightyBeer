import {database} from '../libs/FirebaseApp';
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
  return () => {
    actionsRef.push({
      type: 'calibrate',
      target,
      id,
    });
  }
}
