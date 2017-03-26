import {database} from '../libs/FirebaseApp';
import uuid4 from 'uuid';
var tapsRef = database.ref('app/taps');
import {navigationStart} from './navigation';
import {notify} from './notification';

export const CLEAR_TAP_CHANGES = 'CLEAR_TAP_CHANGES';
export function clearChanges(id) {
  return {
    type: CLEAR_TAP_CHANGES,
    id,
  };
}

export const EDIT_TAP = 'EDIT_TAP';
export function editTap(tap) {
  return {
    type: EDIT_TAP,
    data: tap,
  };
}

export const SAVED_TAP = 'SAVED_TAP';
export function saveTap(tap) {
  const id = tap.id == 'new' ? uuid4() : tap.id;
  return (dispatch) => {
    dispatch(clearChanges(id));
    tapsRef.child(id).set({...tap, id}, () => {
      dispatch(navigationStart('taps', {id}));
      dispatch(notify('"' + tap.name + '"' + ' saved'));
    });
  };
}

export function quickSaveTap(tap) {
  return () => tapsRef.child(tap.id).set(tap);
}

export const RECEIVE_TAPS_DATA = 'RECEIVE_TAPS_DATA';
export function startListeningToTapsData() {
  return (dispatch) => {
    tapsRef.on('value', (snapshot) => {
      dispatch({
        type: RECEIVE_TAPS_DATA,
        data: snapshot.val()
      });
    });
  }
}
