import database from '../libs/FirebaseApp';
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
