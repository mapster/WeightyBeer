import Firebase from 'firebase';
var config = require('../../../firebase-config.json');

var FirebaseApp = Firebase.initializeApp(config);
module.exports = FirebaseApp.database();
