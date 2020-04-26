import React, { Component } from 'react';
import { ReactComponent as CommentIcon } from '../icons/comment-icon.svg'; 
import { ReactComponent as TrashIcon } from '../icons/trash-icon.svg';
import { ReactComponent as PrivateIcon } from '../icons/private-icon.svg';
import { ReactComponent as PublicIcon } from '../icons/public-icon.svg';
import { ReactComponent as UserIcon } from '../icons/user-icon.svg';
import { ReactComponent as CalendarIcon } from '../icons/calendar-icon.svg';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';

class EventCard extends Component {
    state = {
        isParticipated: false
    }

    componentDidMount() {
        if (this.props.auth) {
            if (this.props.auth.participatedEvents.includes(this.props.event._id)) {
                this.setState({ isParticipated: true });
            }
        }
    }

    // handleParticipation = () => {
    //     if (this.state.isParticipated) { //unparticipate
    //         console.log('cancelling participation in event');
    //         this.setState({ isParticipated: false });
    //         this.props.cancelParticipation(this.props._id);
    //     } else { //participate
    //         console.log('participating in event');
    //         this.setState({ isParticipated: true });
    //         this.props.participateInEvent(this.props._id);
    //     }
    // }

    delete = () => {
        this.props.deleteEvent(this.props.event._id);
    }

    render() {
        const { title, organizerNickname, dateCreated, shortDescription, participants, comments, inviteID, urlID } = this.props.event;

        let renderDeleteButton = false; let renderInviteButton = false;

        if (this.props.auth._id == this.props.event._user) { //jesli zalogowany user jest autorem to może usunąć event stworzone przez niego
            renderDeleteButton = true;
            renderInviteButton = true;
        }

        let availability;
        if (this.props.settings.displayIsPublic) {
            if (this.props.event.isPublic) {
                availability = (
                    <><PublicIcon className="card__social-icon"/>
                    <div className="card__social-amount">Public</div></>);
            } else {
                availability = (
                    <><PrivateIcon className="card__social-icon"/>
                    <div className="card__social-amount">Private</div></>);
            }
        } else {
            availability = <></>
        }


        return (
            <div className="card__container">
                <div className="card__header-container">
                    <div className="card__header__user-name">{title}</div>
                    <div className="card__header__creator">
                        <div className="card__header__user">Event's organizer: {organizerNickname}</div>
                        <div className="card__header__date">Event created on {new Date(dateCreated).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="card__content">{shortDescription}</div>
                <div className="card__social-container">
                    <div className="card__social-container--inner">
                        <UserIcon className="card__social-icon"/>
                        <div className="card__social-amount">{participants}</div>
                    </div>
                    <div className="card__social-container--inner">
                        <CommentIcon className="card__social-icon"/>
                        <div className="card__social-amount">{comments.length}</div>
                    </div>
                    <div className="card__social-container--inner">
                        <CalendarIcon className="card__social-icon"/>
                        <div className="card__social-amount">{new Date(dateCreated).toLocaleDateString()}</div>
                    </div>
                    <div className="card__social-container--inner">
                        {availability}
                    </div>
                    <div className="card__social-container--inner card__social-container--inner-invite">
                        <motion.button whileHover={{ y: -1.5, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.12)', transition: {duration: .2} }} whileTap={{ outline: 'none', y: 0, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.05)' }} onClick={() => this.props.history.push(`/event/${urlID}`)}>View event</motion.button>   
                    </div>
                    {renderInviteButton && <div className="card__social-container--inner card__social-container--inner-invite">
                        <motion.button whileHover={{ y: -1.5, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.12)', transition: {duration: .2} }} whileTap={{ outline: 'none', y: 0, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.05)' }} onClick={() => this.props.settings.showInvitePopup(inviteID)}>Invite to event</motion.button>   
                    </div>}
                    {renderDeleteButton && <div className="card__social-container--inner card__social-container--inner-delete">
                        <TrashIcon onClick={this.delete} className="card__social-icon card__social-icon--delete"/>
                    </div>}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, actions)(withRouter(EventCard));