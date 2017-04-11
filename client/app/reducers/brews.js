import * as types from '../actions/brews';
import * as imageActions from '../actions/images';

const initialState = {
  edit: { new: null},
  hasReceivedData: false,
  data: {}, // data from firebase
};

export default function brews(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_BREWS_DATA:
      return {
        ...state,
        hasReceivedData: true,
        data: action.data,
      };
    case types.EDIT_BREW:
      return {
        ...state,
        edit: {...state.edit, [action.data.id]: action.data},
      };
    case types.CLEAR_BREW_CHANGES:
      return {
        ...state,
        edit: {...state.edit, [action.id]: null}
      };
    case imageActions.IMAGE_UPLOADED:
      if (action.target && action.target.brew) {
        return {
          ...state,
          edit: {...state.edit, [action.target.brew]: {...state.edit[action.target.brew], image: action.id}}
        };
      }
      break;
    default:
      return state;
    }
  }
