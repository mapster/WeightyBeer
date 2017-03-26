import React, {PropTypes} from 'react';
import Snackbar from 'material-ui/Snackbar';

const NotificationBar = ({duration = 3000, notification, onNotifyDone}) => (
  <Snackbar
    message={notification.current}
    autoHideDuration={duration}
    open={notification.show}
    onRequestClose={onNotifyDone}
  />
);

NotificationBar.propTypes = {
  duration: PropTypes.number,
  notification: PropTypes.object.isRequired,
  onNotifyDone: PropTypes.func,
};

export default NotificationBar;
