import * as types from '../actions/brews';

const initialState = {
  hasReceivedData: false,
  data: [], // data from firebase
};

export default function taps(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_BREWS_DATA:
      return {
        ...state,
        hasReceivedData: true,
        data: action.data,
      };
    default:
      return state;
  }
}
