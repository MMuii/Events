import axios from 'axios';
//auth related actions
import { FETCH_USER, LOGOUT, SHOW_LOGIN_FORM, HIDE_LOGIN_FORM } from './types';
//event related actions
import { FETCH_PUBLIC, CREATE_EVENT, PARTICIPATE_IN_EVENT, CANCEL_PARTICIPATION, FETCH_EVENT, DELETE_EVENT, FETCH_USER_RELATED } from './types';
//comment related actions
import { COMMENT_EVENT, DELETE_COMMENT, PIN_COMMENT, UNPIN_COMMENT, LIKE_COMMENT, DISLIKE_COMMENT, APPROVE_COMMENT } from './types';
//sorting related actions
import { SORT_EVENTS, SORT_COMMENTS } from './types';
//popup related actions
import { SHOW_POPUP, HIDE_POPUP } from './types';

/////////////////////////////////////////////////////////////////////////////////  AUTH RELATED ACTIONS  /////////////////////////////////////////////////////
export const showLoginForm = () => {
    return { type: SHOW_LOGIN_FORM };
}

export const hideLoginForm = () => {
    return { type: HIDE_LOGIN_FORM };
}

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    
    dispatch({ type: FETCH_USER, payload: res.data });
} 

export const logout = () => async dispatch => {
    await axios.get('/api/logout');
    dispatch({ type: LOGOUT });
}

/////////////////////////////////////////////////////////////////////////////////  EVENT RELATED ACTIONS  /////////////////////////////////////////////////////
export const createEvent = (title, shortDescription, content, date, isPublic, inviteID, urlID) => async dispatch => {
    const res = await axios.post('/api/create_event', { title, shortDescription, content, date, isPublic, inviteID, urlID });
    dispatch({ type: CREATE_EVENT, payload: res.data });
} 

export const fetchEvent = (urlID) => async dispatch => {
    const res = await axios.post('/api/fetch_event', { urlID });
    dispatch({ type: FETCH_EVENT, payload: res.data });
}

export const fetchEventByInviteID = (inviteID) => async dispatch => {
    const res = await axios.post('/api/fetch_event_invitation', { inviteID });
    dispatch({ type: FETCH_EVENT, payload: res.data });
}

export const fetchUserRelatedEvents = () => async dispatch => {
    const res = await axios.get('/api/fetch_user_related');
    dispatch({ type: FETCH_USER_RELATED, payload: res.data });
}

export const fetchPublicEvents = () => async dispatch => {
    const res = await axios.get('/api/fetch_public');
    dispatch({ type: FETCH_PUBLIC, payload: res.data });
}

export const participateInEvent = (_id) => {
    return { type: PARTICIPATE_IN_EVENT, payload: { _id } };
}

export const cancelParticipation = (_id) => {
    return { type: CANCEL_PARTICIPATION, payload: { _id } };
}

export const deleteEvent = (_id) => async dispatch => {
    await axios.post('/api/delete_event', { _id });
    dispatch({ type: DELETE_EVENT, payload: { _id }});
}

/////////////////////////////////////////////////////////////////////////////////  COMMENT RELATED ACTIONS  /////////////////////////////////////////////////////
export const commentEvent = (comment) => {
    return { type: COMMENT_EVENT, payload: comment };
}

export const deleteComment = (_id) => {
    return { type: DELETE_COMMENT, payload: { _id } };
}

export const pinComment = (_id) => {
    return { type: PIN_COMMENT, payload: { _id } };
}

export const unpinComment = (_id) => {
    return { type: UNPIN_COMMENT, payload: { _id } };
}

export const likeComment = (_id) => {
    return { type: LIKE_COMMENT, payload: { _id } };
}

export const dislikeComment = (_id) => {
    return { type: DISLIKE_COMMENT, payload: { _id } };
}

export const approveComment = (_id) => {
    return { type: APPROVE_COMMENT, payload: { _id } };
}

/////////////////////////////////////////////////////////////////////////////////  SORTING RELATED ACTIONS  /////////////////////////////////////////////////////
export const sortEvents = (type, direction) => {
    return { type: SORT_EVENTS, payload: { type, direction } };
}

export const sortComments = (type, direction) => {
    return { type: SORT_COMMENTS, payload: { type, direction } };
}

/////////////////////////////////////////////////////////////////////////////////  POPUP RELATED ACTIONS  /////////////////////////////////////////////////////
export const showPopup = (type, msg) => {
    return { type: SHOW_POPUP, payload: { type, msg } };
}

export const hidePopup = () => {
    return { type: HIDE_POPUP };
}
