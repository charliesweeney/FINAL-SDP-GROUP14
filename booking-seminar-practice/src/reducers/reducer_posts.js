import { FETCH_SEMINARS, EDIT_SEMINAR, FETCH_SEMINAR } from '../actions';
import _ from 'lodash';

export default function(state= {}, action) {
  switch (action.type) {
    case FETCH_SEMINARS:
      return _.mapKeys(action.payload.data, 'key');
    case FETCH_SEMINAR: 
      return { ...state, [action.payload.data.id]: action.payload.data };
    default:
      return state;
    }
}