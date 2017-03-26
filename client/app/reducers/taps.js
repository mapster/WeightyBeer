import * as types from '../actions/taps';

const initialState = {
  edit: { new: null },
  hasReceivedData: false,
  data: {}, // data from firebase
};

export default function taps(state = initialState, action) {
  switch (action.type) {
    case types.EDIT_TAP:
      return {
        ...state,
        edit: {
          ...state.edit,
          [action.data.id]: action.data,
        },
      };
    case types.RECEIVE_TAPS_DATA:
      return {
        ...state,
        data: action.data,
      };
    case types.CLEAR_TAP_CHANGES:
      return {
        ...state,
        edit: {...state.edit, [action.id]: null}
      };
    default:
      return state;
  }
}
