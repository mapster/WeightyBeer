
export const NOTIFICATION = 'NOTIFICATION';
export function notify(text) {
  return {
    type: NOTIFICATION,
    data: text
  };
}

export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export function clearNotification() {
  return {
    type: CLEAR_NOTIFICATION
  };
}
