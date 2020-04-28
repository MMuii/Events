import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DefaultButton from './reusable/DefaultButton';
import * as actions from '../actions';

class InvitationPage extends Component {
    state = {
        pendingRequest: true
    }

    async componentDidMount() {
        await this.props.fetchEventByInviteID(this.props.match.params.inviteID);
        this.setState({ pendingRequest: false });
        if (!this.props.auth) {
            console.log('guest mode');
        }
    }

    redirectToEvent = () => {
        const { isPublic, urlID, inviteID } = this.props.event; 

        if (isPublic) {
            this.props.history.push(`/event/${urlID}`);
        } else {
            this.props.history.push(`/event/${urlID}/${inviteID}`)
        }
    }


    render() {
        if (this.state.pendingRequest) {
            return (
                <div className="default__component-container">
                    <div className="default__component-container--inner">
                        <div className="default__component-header">
                            Loading
                        </div>
                    </div>
                </div>
            )
        }

        if (this.props.event.err) {
            return (
                <div className="default__component-container">
                    <div className="default__component-container--inner">
                        <div className="default__component-header">
                            {this.props.event.err}
                            <DefaultButton text='Back' onClick={() => this.props.history.push('/dashboard')}/>
                        </div>
                    </div>
                </div>
            );
        };

        //przekierowywuje usera bezposrednio do eventu jesli juz w nim uczestniczy albo go stworzyl
        if (this.props.auth && (this.props.auth.participatedEvents.includes(this.props.event._id) ||
                               (this.props.auth._id == this.props.event._user))) {
            this.props.history.push(`/event/${this.props.event.urlID}`);
        }

        const { title, organizerNickname, shortDescription, dateCreated, eventDate, isPublic } = this.props.event;

        return (
            <div className="default__component-container">
                <div className="default__component-container--inner">
                    <div className="default__component-header">
                        You have been invited to {isPublic ? '' : 'private' } event!
                    </div>
                
                    <div className="card__container">
                        <div className="card__header-container">
                            <div className="card__header__user-name">{title}</div>
                            {/* <div className="card__header__creator">
                                <div className="card__header__user">Event created by {organizerNickname}</div>
                                <div className="card__header__date">On {new Date(dateCreated).toLocaleDateString()}</div>
                            </div> */}
                        </div>
                        <div className="card__content">
                            <div className="default__header--2 no-padding-top">Author</div>
                            <div>Event created by {organizerNickname}</div>
                            <div>On {new Date(dateCreated).toLocaleDateString()}</div>
                            <div className="default__header--2">Short description</div>
                            <div>{shortDescription}</div>
                            <div className="default__header--2">Date</div>
                            <div>{new Date(eventDate).toLocaleDateString()} at {new Date(eventDate).toLocaleTimeString()}</div>
                        </div>
                    </div>
                    <DefaultButton text="View event" onClick={this.redirectToEvent} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        event: state.events
    }
}

export default connect(mapStateToProps, actions)(withRouter(InvitationPage));
