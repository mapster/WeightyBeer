import * as types from '../actions/weights';

const initialState = {
  hasReceivedData: false,
  data: {}, // data from firebase
};

export default function weights(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_WEIGHTS_DATA:
      return {
        ...state,
        hasReceivedData: true,
        data: action.data,
      };
    default:
      return state;
  }
}
