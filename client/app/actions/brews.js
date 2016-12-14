import {database} from '../libs/FirebaseApp';
import uuid4 from 'uuid';
var brewsRef = database.ref('app/brews');
import {navigationStart} from './navigation';

export const CLEAR_BREW_CHANGES = 'CLEAR_BREW_CHANGES';
export function clearChanges(id) {
  return {
    type: CLEAR_BREW_CHANGES,
    id
  };
}

export const EDIT_BREW = 'EDIT_BREW';
export function editBrew(brew) {
  return {
    type: EDIT_BREW,
    data: brew
  };
}

export const SAVED_BREW = 'SAVED_BREW';
export function saveBrew(brew) {
  const id = brew.id == 'new' ? uuid4() : brew.id;
  return (dispatch) => {
    dispatch(clearChanges(id));
    brewsRef.child(id).set({...brew, id}, () => {
      dispatch(navigationStart('brewEdit', {id}));
    });
  };
}

export const RECEIVE_BREWS_DATA = 'RECEIVE_BREWS_DATA';
export function startListeningToBrewsData() {
  return (dispatch) => {
    brewsRef.on('value', (snapshot) => {
      dispatch({
        type: RECEIVE_BREWS_DATA,
        data: snapshot.val()
      });
    });
  }
}
