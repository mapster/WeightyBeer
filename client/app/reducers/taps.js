import * as types from '../actions/taps';

const initialState = {
  active: [],
  hasReceivedData: false,
  data: {}, // data from firebase
};

export default function taps(state = initialState, action) {
  switch (action.type) {
    case types.ADD_TAP:
      return  {
        ...state,
        active: [...state.taps, action.tap]
      };
    default:
      return state;
  }
}
