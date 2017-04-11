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

export const IMAGE_DELETED = 'IMAGE_DELETED';
export function deleteImage(id) {
  return () => {
    storageRef.child(id).delete();
    imagesRef.child(id).remove();
  };
}

export const IMAGE_UPLOADED = 'IMAGE_UPLOADED';
export function uploadImage(file, target) {
  return (dispatch) => {
    const id = uuid4();
    storageRef.child(id).put(file).then((snapshot) => {
      imagesRef.child(id).set({
        id,
        url: snapshot.downloadURL,
      });
      dispatch({
        type: IMAGE_UPLOADED,
        id,
        target
      });
    });
  };
}
