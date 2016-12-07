import * as types from '../actions/brews';

const initialState = {
  edit: {},
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
    case types.EDIT_BREW:
      console.log('hei');
      return {
        ...state,
        edit: {...state.edit, [action.data.id]: action.data},
      };
    default:
      return state;
  }
}
