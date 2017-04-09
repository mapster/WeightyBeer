import {database} from '../libs/FirebaseApp';
import uuid4 from 'uuid';
var brewsRef = database.ref('app/brews');
import {navigationStart} from './navigation';
import {notify} from './notification';

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
    if (brew.id == 'new') {
      dispatch(clearChanges('new'));
    }
    dispatch(clearChanges(id));

    let toStore = {...brew, id};
    delete toStore.newImage;
    brewsRef.child(id).set(toStore, () => {
      dispatch(navigationStart('brews', {id}));
      dispatch(notify('"' + toStore.name + '"' + ' saved'));
    });
  };
}

export function deleteBrew(id) {
  return () => {
    brewsRef.child(id).remove();
  }
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
