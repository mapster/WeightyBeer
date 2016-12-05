var firebase = require('firebase');
var config = require('./firebase-config');

firebase.initializeApp(config);

var database = firebase.database();
var id = process.argv[2];
var i = 0;

if (!id) {
  process.exit();
}

function generateData() {
  var a = database.ref('sensors/weight/' + id + '/value');
  a.set(i++);
}

database.ref('sensors/weight/' + id).set({
  id: id,
  // name: 'Beer tap #1',
  // desc: 'Rightmost tap'
});
setInterval(generateData, 1000);
