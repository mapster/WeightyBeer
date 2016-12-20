import {database, storage} from '../libs/FirebaseApp';
import uuid4 from 'uuid';
const imagesRef = database.ref('app/images');
const storageRef = storage.ref('app/images');

export const RECEIVE_IMAGES_DATA = 'RECEIVE_IMAGES_DATA';
export function startListeningToImagesData() {
  return (dispatch) => {
    imagesRef.on('value', (snapshot) => {
      dispatch({
        type: RECEIVE_IMAGES_DATA,
        data: snapshot.val(),
      });
    });
  };
}

export function uploadImage(file) {
  return (dispatch) => {
    const id = uuid4();
    storageRef.child(id).put(file).then((snapshot) => {
      imagesRef.child(id).set({
        id,
        url: snapshot.downloadURL,
      });
    });
  };
}
