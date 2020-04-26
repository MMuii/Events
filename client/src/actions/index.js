import axios from 'axios';
import { FETCH_USER, LOGOUT, FETCH_HOTTEST, FETCH_PUBLIC, PARTICIPATE_IN_EVENT, CANCEL_PARTICIPATION, FETCH_CREATED, FETCH_EVENT, SHOW_LOGIN_FORM, HIDE_LOGIN_FORM, COMMENT_EVENT, DELETE_COMMENT, PIN_COMMENT, UNPIN_COMMENT, LIKE_COMMENT, DISLIKE_COMMENT, APPROVE_COMMENT, DELETE_EVENT, SORT_EVENTS, SORT_COMMENTS, SHOW_POPUP, HIDE_POPUP, FETCH_USER_RELATED } from './types';

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

export const createEvent = (title, shortDescription, content, date, isPublic, inviteID, urlID) => async dispatch => {
    await axios.post('/api/create_event', { title, shortDescription, content, date, isPublic, inviteID, urlID });
    const res = await axios.get('/api/hottest');
    dispatch({ type: FETCH_HOTTEST, payload: res.data });
} 

export const fetchEvent = (urlID) => async dispatch => {
    const res = await axios.post('/api/fetch_event', { urlID });
    dispatch({ type: FETCH_EVENT, payload: res.data });
}

export const fetchEventByInviteID = (inviteID) => async dispatch => {
    const res = await axios.post('/api/fetch_event_invitation', { inviteID });
    dispatch({ type: FETCH_EVENT, payload: res.data });
}

export const fetchCreatedEvents = () => async dispatch => { //prawdopodobnie do usuneicia
    const res = await axios.get('/api/fetch_created_events');
    dispatch({ type: FETCH_CREATED, payload: res.data });
}

export const fetchUserRelatedEvents = () => async dispatch => {
    const res = await axios.get('/api/fetch_user_related');
    dispatch({ type: FETCH_USER_RELATED, payload: res.data });
}

export const fetchHottestEvents = () => async dispatch => { //prawdopodobnie do usuniecia
    const res = await axios.get('/api/hottest');
    dispatch({ type: FETCH_HOTTEST, payload: res.data });
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

export const sortEvents = (type, direction) => {
    return { type: SORT_EVENTS, payload: { type, direction } };
}

export const sortComments = (type, direction) => {
    return { type: SORT_COMMENTS, payload: { type, direction } };
}

export const showPopup = (type, msg) => {
    return { type: SHOW_POPUP, payload: { type, msg } };
}

export const hidePopup = () => {
    return { type: HIDE_POPUP };
}
