import ROUTES from '../routes';
import * as types from '../actions/navigation';

const initialState = {
  transitioning: false,
  location: ROUTES.lookup('home'),
};

export default function navigation(state = initialState, action) {
  switch (action.type) {
    case types.NAVIGATION_COMPLETE:
      return {
        transitioning: false,
        location: action.location,
      };
    case types.NAVIGATION_START:
      return {
        ...state,
        transitioning: true,
      };
    default:
      return state;
  }
}
