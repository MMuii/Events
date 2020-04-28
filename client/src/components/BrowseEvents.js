import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import EventCard from './EventCard';
import InvitePopup from './InvitePopup';

import { ReactComponent as ArrowUpIcon } from '../icons/arrow-up-icon.svg';
import { ReactComponent as ArrowDownIcon } from '../icons/arrow-down-icon.svg';

class BrowseEvents extends Component {
    state = {
        pendingRequest: true,
        invite: {
            showInvitePopup: false,
            inviteID: ''
        },
        sorting: {
            type: 'participants',
            direction: 'desc'
        }
    }

    async componentDidMount() {
        if (!this.props.auth) { //if user is not logged in, redirect to auth page
            this.props.history.push('/login'); 
        }
        
        await this.props.fetchPublicEvents();
        this.setState({ pendingRequest: false }, () => {
            console.log('browse events state:', this.state);
        });
    }

    showInvitePopup = (inviteID) => {
        // console.log("dziala");
        this.setState({ invite: {showInvitePopup: true, inviteID: inviteID }}, () => {
            console.log(this.state);
        });
    }

    changeSorting = (type) => {
        if (type != this.state.sorting.type) { //changes type of sorting
            this.setState({ sorting: { type: type, direction: 'desc' }}, () => {
                this.props.sortEvents(this.state.sorting.type, this.state.sorting.direction);
            });
        } else { //changes only direction of sorting
            const newDirection = (this.state.sorting.direction == 'asc') ? 'desc' : 'asc';

            this.setState({ sorting: { ...this.state.sorting, direction: newDirection }}, () => {
                this.props.sortEvents(this.state.sorting.type, this.state.sorting.direction);
            });
        }
    }

    renderEventCards() {
        const settings = {
            showInvitePopup: this.showInvitePopup,
            displayIsPublic: false
        }

        const eventCards = this.props.events.map(event => {
            return <EventCard key={event._id} event={event} settings={settings}/>
        })

        return eventCards;
    }

    renderContent() {
        if (this.state.pendingRequest) {
            return <div className="default__header--2">Loading</div>;
        }

        if (!this.props.events) {
            return <div className="default__header--2">You haven't created any events yet</div>;
        } else {
            return <div className="default__header--2">{this.renderEventCards()}</div>;
        }
    }

    render() {
        const { invite, sorting } = this.state;

        const arrow = sorting.direction == 'desc' 
                    ? <ArrowDownIcon className="browse__sort-icon"/>
                    : <ArrowUpIcon className="browse__sort-icon" />
        
        return (<>
            {invite.showInvitePopup && <InvitePopup close={() => this.setState({ invite: {showInvitePopup: false, inviteID: '' }})} inviteID={invite.inviteID}/>}
            <div className="default__component-container">
                <div className="default__component-container--inner">
                    <div className="default__component-header browse__header">
                        Browse events
                        <span>Sort by:</span>
                        <span className={sorting.type == 'participants' ? 'browse__active-sorting' : undefined}
                              onClick={() => this.changeSorting('participants')}>
                            participants
                            {sorting.type == 'participants' && arrow}
                        </span>
                        <span className={sorting.type == 'dateCreated' ? 'browse__active-sorting' : undefined}
                              onClick={() => this.changeSorting('dateCreated')}>
                            date
                            {sorting.type == 'dateCreated' && arrow}
                        </span>
                    </div>
                    {this.renderContent()}
                </div>
            </div>
        </>)
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        events: state.events
    }
}


export default connect(mapStateToProps, actions)(withRouter(BrowseEvents));
