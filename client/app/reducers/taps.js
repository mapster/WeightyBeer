import * as types from '../actions/taps';

const initialState = {
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
    case types.RECEIVE_TAPS_DATA:
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}
