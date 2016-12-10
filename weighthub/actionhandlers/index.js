const calibrateHandler = require('./calibrateHandler');

function handleAction(weightsRef, sensorsRef, actionSnap) {
  var action = actionSnap.val();
  actionSnap.ref.remove();

  switch (action.type) {
    case 'calibrate':
      calibrateHandler(weightsRef, sensorsRef, action);
      break;
    default:
      console.log('Unknown action requested: ' + action.type);
  }
}

module.exports = handleAction;
