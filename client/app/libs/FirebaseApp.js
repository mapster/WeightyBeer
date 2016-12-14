import Firebase from 'firebase';
var config = require('../../../firebase-config.json');

var FirebaseApp = Firebase.initializeApp(config);
export const database = FirebaseApp.database();
export const storage = FirebaseApp.storage();
