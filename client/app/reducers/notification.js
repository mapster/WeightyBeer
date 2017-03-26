import * as types from '../actions/notification';

const initialState = {
  current: '',
  previous: [],
  show: false,
};

const append = (arr, el) => el != '' ? [...arr, el] : arr;

export default function notification(state = initialState, action) {
  if(action.type == types.NOTIFICATION) {
    return {
      previous: append(state.previous, state.current),
      current: action.data,
      show: true,
    };
  } else if(action.type == types.CLEAR_NOTIFICATION) {
    return {
      previous: append(state.previous, state.current),
      current: '',
      show: false
    };
  } else {
    return state;
  }
}
