import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import * as actions from '../actions';
import axios from 'axios';
import _ from 'lodash';

import { ReactComponent as UserIcon } from '../icons/user-icon.svg';
import { ReactComponent as TrashIcon } from '../icons/trash-icon.svg';
import { ReactComponent as ArrowUpIcon } from '../icons/arrow-up-icon.svg';
import { ReactComponent as ArrowDownIcon } from '../icons/arrow-down-icon.svg';

import DefaultButton from './reusable/DefaultButton';
import AuthPage from './AuthPage';
import Comment from './Comment';
import PopupManager from './PopupManager';

class EventPage extends Component {
    state = {
        pendingRequest: true,
        didUserCreatedEvent: false,
        alreadyJoined: false,
        joinMsg: '',
        commentText: '',
        socket: null,
        errors: {
            cantJoinPrivateEvent: false
        },
        sorting: {
            type: 'dateCreated',
            direction: 'desc'
        }
    }

    async componentDidMount() {
        await this.props.fetchEvent(this.props.match.params.urlID);
        const socket = socketIOClient(process.env.REACT_APP_SOCKETIO_ENDPOINT);

        this.setState({ ...this.state, pendingRequest: false, socket: socket });
        this.setupSockets();
        this.setAuthBasedSettings();

        //sorts comments to display them in correct order
        this.props.sortComments(this.state.sorting.type, this.state.sorting.direction);
    }

    setAuthBasedSettings() {
        const { event, auth } = this.props;
        let newState = this.state;
        newState.event = event;

        if (auth) { //USER LOGGED IN
            //checks if user has already joined the event
            if (auth.participatedEvents.includes(event._id)) { 
                newState.alreadyJoined = true;
                newState.joinMsg = 'You have joined the event!';
            }

            //checks if logged user is an organizer of the event
            if (auth._id == event._user) { 
                newState.didUserCreatedEvent = true;
            }
    
            //if he is, he can't join his event as its organizer
            if (newState.didUserCreatedEvent) { 
                newState.joinMsg = 'You are the event\'s organizer';
            }
    
            //if event is private, user didn't create it and hasn't joined it yet, he can't see the event... 
            if (!event.isPublic && !auth.participatedEvents.includes(event._id) && !newState.didUserCreatedEvent) { 
                //...unless he's coming from invitation and event's inviteID is given in URL
                if (this.props.match.params.inviteID != event.inviteID) {
                    newState.errors.cantJoinPrivateEvent = true;
                }
            }
        } else if (!auth) { //USER NOT LOGGED IN
            //when user is not logged in, the only way he can see the event is by invitation
            if (!event.isPublic && this.props.match.params.inviteID != event.inviteID) {
                newState.errors.cantJoinPrivateEvent = true;
            }
        }

        this.setState({ ...this.state, newState });
    }

    //disconnects websocket when component unmounts
    componentWillUnmount() { 
        if (this.state.socket) {
            this.state.socket.close();
        }
    }

    //connects websocket and setups its event handlers
    setupSockets() {
        const { socket } = this.state;
        
        socket.on('new_comment', comment => {
            this.props.commentEvent(comment);
            this.props.sortComments(this.state.sorting.type, this.state.sorting.direction);
        });

        socket.on('approved_comment', comment => {
            this.props.approveComment(comment._id);
        });

        socket.on('pinned_comment', comment => {
            this.props.pinComment(comment._id);
        });

        socket.on('unpinned_comment', comment => {
            this.props.unpinComment(comment._id);
        });
    }

    changeSorting = (type) => {
        if (type != this.state.sorting.type) { //changes type of sorting
            this.setState({ sorting: { type: type, direction: 'desc' }}, () => {
                this.props.sortComments(this.state.sorting.type, this.state.sorting.direction);
            });
        } else { //changes only direction of sorting
            const newDirection = (this.state.sorting.direction == 'asc') ? 'desc' : 'asc';

            this.setState({ sorting: { ...this.state.sorting, direction: newDirection }}, () => {
                this.props.sortComments(this.state.sorting.type, this.state.sorting.direction);
            });
        }
    }

    deleteEvent = async () =>  {
        await axios.post('/api/delete_event', { _id: this.props.event._id });
        this.props.history.push('/dashboard');
    }

    joinEvent = async () => {
        if (!this.props.auth) {
            this.props.showLoginForm();
        } else {
            try {
                await axios.post('/api/participate_in_event', { _id: this.props.event._id });
                this.props.participateInEvent(this.props.event._id); //aktualizuje auth i event w reduxie
                this.setState({ joinMsg: 'Joined event!',
                                alreadyJoined: true});
            } catch (err) {
                this.setState({ joinMsg: 'Couldn\'t join event, unidentified error' });
            }
        }
    }

    leaveEvent = async () => {
        try {
            await axios.post('/api/cancel_participation', { _id: this.props.event._id });
            this.props.cancelParticipation(this.props.event._id);
            this.setState({ joinMsg: 'You have left the event.',
                            alreadyJoined: false }, () => {
                setTimeout(() => {
                    this.setState({ joinMsg: '' });
                }, 2500);
            })
        } catch (err) {
            this.setState({ joinMsg: 'Couldn\'t leave event, unidentified error' });
        }
    }

    //controlls input forms
    handleChange({ target: { value }}) {
        this.setState({ commentText: value });
    }

    //pushes new popup to popup manager
    newPopup = (type, msg, time) => {
        this.props.showPopup(type, msg);
    
        //after certain amount of time popup disappears
        setTimeout(() => {
            this.props.hidePopup();
        }, time);
    }


    commentEvent = async (e) => {
        e.preventDefault();

        //cannot send empty comment
        if (this.state.commentText.length < 1) {
            return;
        }

        if (this.props.auth && (this.state.alreadyJoined || this.state.didUserCreatedEvent)) {
            try {
                //event organizer's comments are approved by default
                const approved = this.state.didUserCreatedEvent ? true : false; 
                const nickname = this.props.auth.nickname;
    
                const comment = await axios.post('/api/comment_event', { 
                    eventId: this.props.event._id, 
                    content: this.state.commentText, 
                    nickname,
                    approved 
                });
                this.newPopup('success', 'Comment added!', 1500);            
                this.props.commentEvent(comment.data);
                this.state.socket.emit('new_comment', comment);
                this.props.sortComments(this.state.sorting.type, this.state.sorting.direction);
                this.setState({ commentText: '' });
            } catch (err) {
                this.newPopup('error', 'Couldnt add new comment', 1500);
                // alert('Couldnt create new comment, unidentified error');
            }
        } else if (this.props.auth && !this.state.alreadyJoined && !this.state.didUserCreatedEvent) {
            this.newPopup('success', 'You must join the event to leave a comment', 2500);
            // alert('You must join the event to leave a comment');
            // this.props.showLoginForm();
        } else if (!this.props.auth) {
            // alert('You must login and join the event to leave a comment');
            this.newPopup('success', 'You must login and join the event to leave a comment', 2500);
            // this.props.showLoginForm();
        }
    }

    renderComments() {
        const { didUserCreatedEvent } = this.state;

        const comments = this.props.event.comments.map(({likes, content, nickname, dateCreated, _id, _user, isPinned, approved}) => {
            let canDeleteComment = false, canPinComment = false, isLiked = false, authorName;

            if (didUserCreatedEvent || ((this.props.auth._id === _user) && (_user !== null))) {
                canDeleteComment = true;
            }
            if (didUserCreatedEvent) {
                canPinComment = true;
            }
            if (this.props.auth && this.props.auth.likedComments.includes(_id)) {
                isLiked = true;
            }

            authorName = nickname;
            if (this.props.event._user == _user) {
                authorName = 'Event\'s organizer';
            }

            return (
                <Comment key={_id} text={content} likes={likes} authorName={authorName} dateCreated={dateCreated} _id={_id} eventId={this.props.event._id} canDeleteComment={canDeleteComment} canPinComment={canPinComment} isPinned={isPinned} isLiked={isLiked} approved={approved} didUserCreatedEvent={didUserCreatedEvent} _user={_user} socket={this.state.socket}/>
            );
        })

        const unpinnedComments = comments.filter((comment) => {
            //if user is event's organizer, he can see unapproved comments
            if (didUserCreatedEvent) {
                //unapproved comments can pass through filter
                return comment.props.isPinned == false; 
            } else {
                //comments that are approved or unapproved and created by user who isn't event's organizer can pass through filter
                return (comment.props.isPinned == false && 
                       (comment.props.approved == true) || (comment.props.approved == false && comment.props._user == this.props.auth._id));
            }
        });

        const pinnedComments = comments.filter((comment) => {
            return comment.props.isPinned == true;
        });

        return <>{pinnedComments}{unpinnedComments}</>;
    }

    renderContent() {
        if (this.state.pendingRequest) {
            return (
                <div className="default__component-header">
                    Loading
                </div>
            );
        }
        if (this.props.event.err) {
            return (
                <div className="default__component-header">
                    {this.props.event.err}
                </div>
            );
        }
        if (this.state.errors.cantJoinPrivateEvent) { 
            return (
                <div className="default__component-header">
                    This event is private, you need an invitation to see the event.
                </div>
            );
        }

        const { content, eventDate, participants, comments } = this.props.event;
        let buttonText, btnOnClick, commentsAmount = 0;
        if (this.props.auth && this.state.alreadyJoined) { //user logged in and already joined event
            buttonText = 'Leave event';
            btnOnClick = this.leaveEvent;
        } else if (!this.props.auth) { //user not logged in
            buttonText = 'Login and join event';
            btnOnClick = this.joinEvent;
        } else if ((this.props.auth && this.state.didUserCreatedEvent) ||
                    this.props.auth && !this.state.alreadyJoined) { //user is logged in and user is event's organizer or hasn't joined event yet
            buttonText = 'Join event';
            btnOnClick = this.joinEvent;
        };

        for (let i = 0; i < comments.length; i++) {
            if (comments[i].approved) {
                commentsAmount++;
            }
        }

        const arrow = this.state.sorting.direction == 'desc' 
        ? <ArrowDownIcon className="event__sort-icon"/>
        : <ArrowUpIcon className="event__sort-icon" />

        let mql = window.matchMedia("screen and (max-width: 500px)"); 

        return (<>
            <div className="default__component-header event__header">
                {this.props.event.title}
                {(this.state.didUserCreatedEvent && !mql.matches) && 
                    <div onClick={this.deleteEvent}>
                        <span>Delete event</span>
                        <TrashIcon className="event__delete"/>
                    </div>
                }
            </div>
            <div className="event__master-container">
                <div className="event__content-container">
                    <div className="default__header--2">Event's organizer</div>
                    <div className="event__content">{this.props.event.organizerNickname}</div>
                    <div className="default__header--2">Description</div>
                    <div className="event__content">{content}</div>
                    <div className="default__header--2">Date</div>
                    <div className="event__content">{new Date(eventDate).toLocaleDateString()} at {new Date(eventDate).toLocaleTimeString()}</div>
                    <div className="event__social-container">
                        <div className="event__social-icon-container">
                            <UserIcon className="event__social-icon"/><span>{participants} participants</span>
                        </div>
                    </div>
                    <div className="event__join-container">
                        <DefaultButton text={buttonText} 
                                       inactive={this.state.didUserCreatedEvent} 
                                       onClick={btnOnClick}/>
                        <div className="event__join-msg">{this.state.joinMsg}</div>
                    </div>
                </div>
                <div className="event__comments-container">
                    <div className="event__comments-header-container">
                        <span className="event__comments-header-amount">{commentsAmount}</span>
                        <span className="event__comments-header-text">{commentsAmount == 1 ? 'comment' : 'comments'}</span>
                        <span className="event__comments-header-sort-by">Sort by:</span>
                        <span className={`event__comments-header-likes 
                                        ${this.state.sorting.type == 'likes' 
                                        ? 'event__active-sorting' 
                                        : undefined}`}
                              onClick={() => this.changeSorting('likes')}>
                            likes
                            {this.state.sorting.type == 'likes' && arrow}
                        </span>
                        <span className={`event__comments-header-date 
                                        ${this.state.sorting.type == 'dateCreated' 
                                        ? 'event__active-sorting' 
                                        : undefined}`}
                              onClick={() => this.changeSorting('dateCreated')}>
                            date
                            {this.state.sorting.type == 'dateCreated' && arrow}
                        </span>
                    </div>
                    <div className="event__comments-container--inner" id="comments-container">
                        {(this.state.alreadyJoined || this.state.didUserCreatedEvent) 
                         ? this.renderComments() 
                         : <div className="event__comments-login-to-see">You must join event to see comments</div>}
                    </div>
                    <form className={`default__input-with-btn-container
                                      event__comments-new-comment-container
                                      ${(this.state.alreadyJoined || this.state.didUserCreatedEvent) 
                                        ? '' 
                                        : 'event__comments-new-comment-container--not-joined'}`} 
                          onSubmit={this.commentEvent}>
                        <button type="submit">Send</button>
                        <input className="default__input-field" type="text" placeholder="Leave a comment" value={this.state.commentText} onChange={(e) => this.handleChange(e)}/>
                    </form>
                </div>
            </div></>
        );
    }

    hideLoginForm = () => {
        console.log('Hiding login form');
        this.props.hideLoginForm();
        this.setAuthBasedSettings();
    }

    render() {
        if (this.props.authForm) {
            return <AuthPage callback={this.hideLoginForm} showBackButton={true}/>;
        }

        return (<>
            <PopupManager />
            <div className="default__component-container event">
                <div className="default__component-container--inner">
                    {this.renderContent()}
                </div>
            </div>
        </>)
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        event: state.events,
        authForm: state.authForm
    }
}

export default connect(mapStateToProps, actions)(withRouter(EventPage));