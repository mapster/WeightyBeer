var firebase = require('firebase');
var config = require('../firebase-config');

firebase.initializeApp(config);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const database = firebase.database();
var id = process.argv[2];
const INITIAL_BASE = 814124;

var base = INITIAL_BASE;

if (!id) {
  console.log("No weight sensor id given.")
  process.exit();
}
console.log("Simulating weight sensor " + id + " with base " + base);

const valRef = database.ref('sensors/weight/' + id + '/value');
function generateData() {
  valRef.set(base + getRandomInt(0, 15));
}

database.ref('sensors/weight/' + id).set({
  id: id,
  value: INITIAL_BASE,
});
setInterval(generateData, 1000);

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(cmd) {
  var arr = cmd.split(" ", 2);
  if(arr[0] == 'up') {
    base += parseInt(arr[1]);
    console.log("Base increased to: " + base);
  } else if(arr[0] == 'down') {
    base -= parseInt(arr[1]);
    console.log("Base decreased to: " + base);
  } else if(cmd.trim() == 'reset') {
    base = INITIAL_BASE;
    console.log("Base reset to: " + base);
  } else {
    console.log("Unknown command: " + cmd);
  }
});
