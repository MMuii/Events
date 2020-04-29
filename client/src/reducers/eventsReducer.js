//event related actions
import { FETCH_EVENT, FETCH_PUBLIC, CREATE_EVENT, PARTICIPATE_IN_EVENT, CANCEL_PARTICIPATION, DELETE_EVENT, FETCH_USER_RELATED } from '../actions/types';
//comment related actions
import { COMMENT_EVENT, DELETE_COMMENT, PIN_COMMENT, UNPIN_COMMENT, LIKE_COMMENT, DISLIKE_COMMENT, APPROVE_COMMENT } from '../actions/types';
//sorting related actions
import { SORT_EVENTS, SORT_COMMENTS } from '../actions/types';
import _ from 'lodash';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_EVENT:
        case FETCH_PUBLIC:
        case FETCH_USER_RELATED:
            return action.payload || false;
        case PARTICIPATE_IN_EVENT:
        case CANCEL_PARTICIPATION: {
            console.log('state w reducerze:', state);
            if (Array.isArray(state)) {
                return state.map(event => {
                    if (event._id === action.payload._id) {
                        if (action.type === PARTICIPATE_IN_EVENT) {
                            return { ...event, participants: event.participants + 1 };
                        } else if (action.type === CANCEL_PARTICIPATION) {
                            return { ...event, participants: event.participants - 1 };
                        }
                    }
                    return event;
                });
            } else {
                switch (action.type) {
                    case PARTICIPATE_IN_EVENT:
                        return { ...state, participants: state.participants + 1};
                    case CANCEL_PARTICIPATION:
                        return { ...state, participants: state.participants - 1};
                }
            }
        }
        case CREATE_EVENT: {
            let newArr = state.slice();
            newArr.push(action.payload);
            return newArr;
        }
        case DELETE_EVENT: {
            let newArr = state.slice(); 

            _.remove(newArr, {
                _id: action.payload._id
            });

            return newArr;
        }
        case COMMENT_EVENT: {
            let newArr = state.comments.slice();
            newArr.push(action.payload);
            return { ...state, comments: newArr };
        }
        case DELETE_COMMENT: {
            let newArr = state.comments.slice();
            _.remove(newArr, {
                _id: action.payload._id
            });

            return { ...state, comments: newArr };
        }
        case PIN_COMMENT:
        case UNPIN_COMMENT: {
            let newArr = state.comments.slice(); 

            newArr = state.comments.map((comment) => {
                if (comment._id == action.payload._id) {
                    comment.isPinned = (action.type == PIN_COMMENT ? true : false);
                };
                return comment;
            });

            return { ...state, comments: newArr };
        }
        case LIKE_COMMENT:
        case DISLIKE_COMMENT: {
            const newArr = state.comments.map((comment) => {
                if (comment._id == action.payload._id) {
                    if (action.type == LIKE_COMMENT) {
                        comment.likes += 1;
                    } else if (action.type == DISLIKE_COMMENT) {
                        comment.likes -= 1;
                    }
                };
                return comment;
            });

            return { ...state, comments: newArr };
        }
        case APPROVE_COMMENT: {
            const newArr = state.comments.map((comment) => {
                if (comment._id == action.payload._id) {
                    comment.approved = true;
                };
                return comment;
            });

            return { ...state, comments: newArr };
        }

        case SORT_EVENTS: {
            const newArr = _.sortBy(state, [`${action.payload.type}`]);

            if (action.payload.direction == 'desc') {
                newArr.reverse();
            }

            return newArr;
        }
        case SORT_COMMENTS: {
            const newArr = _.sortBy(state.comments, [`${action.payload.type}`,]);

            if (action.payload.direction == 'desc') {
                newArr.reverse();
            }
            return { ...state, comments: newArr };
        }
        default: 
            return state;
    }
}