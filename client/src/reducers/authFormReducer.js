import { SHOW_LOGIN_FORM } from '../actions/types';
import { HIDE_LOGIN_FORM } from '../actions/types';

export default function(state = false, action) {
    switch (action.type) {
        case SHOW_LOGIN_FORM:
            return true;
        case HIDE_LOGIN_FORM:
            return false;
        default: 
            return state;
    }
}