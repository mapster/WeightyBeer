import ROUTES from '../routes.js';

export const NAVIGATION_START = 'NAVIGATION_START';
export function navigationStart(name, options) {
  return (dispatch) => {
    let currentURI = window.location.hash.substr(1);
    let newURI = ROUTES.generate(name, options);

    if (currentURI != newURI) {
      dispatch({
        type: NAVIGATION_START
      });

      window.location.replace(
        window.location.pathname + window.location.search + '#' + newURI
      );
    }
  };
}

export const NAVIGATION_COMPLETE = 'NAVIGATION_COMPLETE';
export function navigationComplete() {
  return {
    type: NAVIGATION_COMPLETE,
    location: ROUTES.lookup(window.location.hash.substr(1)),
  }
}
