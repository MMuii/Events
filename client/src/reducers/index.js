import { combineReducers } from 'redux';
import authReducer from './authReducer';
import eventsReducer from './eventsReducer';
import authFormReducer from './authFormReducer';
import popupsReducer from './popupsReducer';

export default combineReducers({
    auth: authReducer,
    authForm: authFormReducer,
    events: eventsReducer,
    popups: popupsReducer
});