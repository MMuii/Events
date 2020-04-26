// import { FETCH_USER, CANCEL_PARTICIPATION } from '../actions/types';
// import { LOGOUT } from '../actions/types';
// import { PARTICIPATE_IN_EVENT } from '../actions/types';
// import _ from 'lodash';

import { SHOW_POPUP, HIDE_POPUP } from '../actions/types';
import _ from 'lodash';

// export default function(state = null, action) {
//     switch (action.type) {
//         case FETCH_USER:
//             return action.payload || false;
//         // case REGISTER_USER:
//         //     return action.payload || false;
//         case LOGOUT:
//             return false;
//         case PARTICIPATE_IN_EVENT: {
//             let newArr = state.participatedEvents.slice();
//             newArr.push(action.payload._id);
//             return { ...state, participatedEvents: newArr };
//         }
//         case CANCEL_PARTICIPATION: {
//             let newArr = state.participatedEvents.slice();
//             _.pull(newArr, action.payload._id);
//             return { ...state, participatedEvents: newArr };
//         }
//         default: 
//             return state;
//     }
// }

export default function(state = [], action) {
    switch (action.type) {
        case SHOW_POPUP: {
            let newArr = state.slice();
            newArr.unshift({
                type: action.payload.type,
                msg: action.payload.msg
            });
            return newArr;
        }

        case HIDE_POPUP: {
            let newArr = state.slice();
            newArr.pop();
            return newArr;
        }
        default: return state;
    }
}