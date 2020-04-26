import { FETCH_USER, CANCEL_PARTICIPATION } from '../actions/types';
import { LOGOUT } from '../actions/types';
import { PARTICIPATE_IN_EVENT } from '../actions/types';
import _ from 'lodash';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false;
        // case REGISTER_USER:
        //     return action.payload || false;
        case LOGOUT:
            return false;
        case PARTICIPATE_IN_EVENT: {
            let newArr = state.participatedEvents.slice();
            newArr.push(action.payload._id);
            return { ...state, participatedEvents: newArr };
        }
        case CANCEL_PARTICIPATION: {
            let newArr = state.participatedEvents.slice();
            _.pull(newArr, action.payload._id);
            return { ...state, participatedEvents: newArr };
        }
        default: 
            return state;
    }
}