import Firebase from 'firebase';
const config = require('../../firebase-config.json');

const FirebaseApp = Firebase.initializeApp(config);
export const database = FirebaseApp.database();
export const storage = FirebaseApp.storage();
