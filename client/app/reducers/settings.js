import * as types from '../actions/settings';

const initialState = [];

export default function taps(state = initialState, action) {
  switch (action.type) {
    case types.ADD_TAP:
      return [...state, action.tap];
    default:
      return state;
  }
}
