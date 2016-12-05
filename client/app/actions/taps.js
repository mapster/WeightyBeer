import database from '../libs/FirebaseApp';
var tapsRef = database.ref('weighthub/weights');

export const ADD_TAP = 'ADD_TAP';
export function addTap(tap) {
  return {
    type: ADD_TAP,
    tap: {
      name: tap.name
    }
  }
}

export const RECEIVE_TAPS_DATA = 'RECEIVE_TAPS_DATA';
export function startListeningToWeightHub() {
  return (dispatch) => {
    tapsRef.on('value', (snapshot) => {
      dispatch({
        type: RECEIVE_TAPS_DATA,
        data: snapshot.val()
      });
    });
  }
}
