import database from '../libs/FirebaseApp';
import uuid4 from 'uuid';
var brewsRef = database.ref('app/brews');

export const ADD_BREW = 'ADD_BREW';
export function addBrew(brew) {
  return {
    type: ADD_BREW,
    brew: {
      name: brew.name
    }
  }
}

export const EDIT_BREW = 'EDIT_BREW';
export function editBrew(brew) {
  return {
    type: EDIT_BREW,
    data: brew
  }
}

export const SAVED_BREW = 'SAVED_BREW';
export function saveBrew(brew) {
  const id = brew.id == 'new' ? uuid4() : brew.id;
  return (dispatch) => {
    brewsRef.child(brew.id).set(brew, () => dispatch({
      type: SAVED_BREW,
      id,
    }));
  };
}

export const RECEIVE_BREWS_DATA = 'RECEIVE_BREWS_DATA';
export function startListeningToAppData() {
  return (dispatch) => {
    brewsRef.on('value', (snapshot) => {
      dispatch({
        type: RECEIVE_BREWS_DATA,
        data: snapshot.val()
      });
    });
  }
}
