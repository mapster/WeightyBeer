import * as types from '../actions/images';

const initialState = {
  hasReceivedData: false,
  data: {},
};

export default function images(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_IMAGES_DATA:
      return {
        ...state,
        hasReceivedData: true,
        data: action.data,
      }
    default:
      return state;
  }
}
