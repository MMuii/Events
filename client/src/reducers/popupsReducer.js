import { SHOW_POPUP, HIDE_POPUP } from '../actions/types';
import _ from 'lodash';

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