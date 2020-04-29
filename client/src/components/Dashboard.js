import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';

import EventCard from './EventCard';
import InvitePopup from './InvitePopup';
import PopupManager from './PopupManager';
import DefaultButton from './reusable/DefaultButton';

class Dashboard extends Component {
    state = {
        pendingRequest: true,
        invite: {
            showInvitePopup: false,
            inviteID: ''
        }
    }

    async componentDidMount() {
        // await axios.get('/api/fetch_user_related');
        if (this.props.auth === false) {
            console.log("Redirecting from dashboard to login because user is not logged in");
            this.props.history.push('/login');
        } else {
            console.log("User is logged in, nickname:", this.props.auth.nickname);
        }

        // await this.props.fetchCreatedEvents();
        await this.props.fetchUserRelatedEvents();
        this.setState({ pendingRequest: false }, () => {
            console.log('dashboard props:', this.props);
        });
    }

    logout = async () => {
        await this.props.logout();
        this.props.history.push('/login');
    }

    renderCreatedEvents() {
        if (!this.props.auth) return;

        if (this.state.pendingRequest) {
            return <div className="default__header--2">Loading</div>;
        }

        if (this.props.events == false) {
            return (<>
                <div className="default__header--2">You haven't joined any events yet</div>
                <DefaultButton text="Create event" onClick={() => this.props.history.push('/create-event')}/>
            </>)
        }

        const createdEvents = this.props.events.filter(event => {
            return event._user == this.props.auth._id;
        }).map(event => {
            const settings = {
                displayIsPublic: true,
                showInvitePopup: this.showInvitePopup
            }

            return <EventCard key={event._id} event={event} settings={settings} />
        });

        if (createdEvents.length == 0) {
            return (<>
                <div className="default__header--2">You haven't joined any events yet</div>
                <DefaultButton text="Create event" onClick={() => this.props.history.push('/create-event')}/>
            </>)
        }

        return createdEvents;
    }

    renderParticipatedEvents() {
        if (!this.props.auth) return;

        if (this.state.pendingRequest) {
            return <div className="default__header--2">Loading</div>;
        }

        if (this.props.events == false) {
            return (<>
                <div className="default__header--2">You haven't joined any events yet</div>
                <DefaultButton text="Browse events" onClick={() => this.props.history.push('/browse')}/>
            </>);
        }

        const participatedEvents = this.props.events.filter(event => {
            return this.props.auth.participatedEvents.includes(event._id);
        }).map(event => {
            const settings = {
                displayIsPublic: false,
                showInvitePopup: null
            }

            return <EventCard key={event._id} event={event} settings={settings} />
        });

        if (participatedEvents.length == 0) {
            return (<>
                <div className="default__header--2">You haven't joined any events yet</div>
                <DefaultButton text="Browse events" onClick={() => this.props.history.push('/browse')}/>
            </>)
        }

        return participatedEvents;
    }

    showInvitePopup = (inviteID) => {
        this.setState({ invite: {showInvitePopup: true, inviteID: inviteID }});
    }

    newPopup = (type, msg, time) => {
        this.props.showPopup(type, msg);
    
        setTimeout(() => {
            this.props.hidePopup();
        }, time);
    }

    render() {
        const { invite } = this.state;

        return (
            <>
            <PopupManager />
            {invite.showInvitePopup && <InvitePopup close={() => this.setState({ invite: {showInvitePopup: false, inviteID: '' }})} inviteID={invite.inviteID}/>}
            <div className="default__component-container">
                <div className="default__component-container--inner">
                    <div className="events__container">
                        <div className="events__hottest">
                            <div className="default__component-header">Events you've created</div>
                            {this.renderCreatedEvents()}
                        </div>
                        <div className="events__your">
                            <div className="default__component-header">Events you've joined</div>
                            {this.renderParticipatedEvents()}
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        events: state.events,
        popups: state.popups
    }
}

export default connect(mapStateToProps, actions)(withRouter(Dashboard));