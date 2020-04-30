import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import * as actions from '../actions';

import Header from './Header';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import CreateEvent from './CreateEvent';
import InvitationPage from './InvitationPage';
import EventPage from './EventPage';
import AccountDetails from './AccountDetails';
import BrowseEvents from './BrowseEvents';
import Error404 from './Error404';
import Footer from './Footer';

class App extends Component {
    async componentDidMount() {
        await this.props.fetchUser();
    }

    render() {
        if (this.props.auth == null) { //still fetching user
            return (
                <div className="container">
                    <div className="background-gradient"></div>
                    <div className="default__component-container event">
                        <div className="default__component-container--inner">
                            <div className="default__component-header">
                                Loading
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.props.auth == false) { //user not logged in
            return (
                <div className="container"> 
                <div className="background-gradient"></div>
                <BrowserRouter>
                    <AnimatePresence>
                        <Header auth={this.props.auth}/>
                    </AnimatePresence>
                    <Switch>
                        <Route exact path="/"><Redirect to="/login" /></Route>
                        <Route exact path="/dashboard"><Redirect to="/login" /></Route>
                        <Route exact path="/create-event"><Redirect to="/login" /></Route>
                        <Route exact path="/account-details"><Redirect to="/login" /></Route>
                        <Route exact path="/browse"><Redirect to="/login" /></Route>
                        <Route exact path="/login" component={AuthPage} />
                        <Route exact path="/invitation/:inviteID" component={InvitationPage} />
                        <Route exact path="/event/:urlID/:inviteID?" component={EventPage} />
                        <Route component={Error404} />
                    </Switch>
                </BrowserRouter>
                <Footer />
            </div>
            )
        }

        //user logged in
        return (  
            <div className="container"> 
                <div className="background-gradient"></div>
                <BrowserRouter>
                    <AnimatePresence>
                        <Header auth={this.props.auth}/>
                    </AnimatePresence>
                    <Switch>
                        <Route exact path="/"><Redirect to="/dashboard" /></Route>
                        <Route exact path="/login" component={AuthPage} />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/create-event" component={CreateEvent} />
                        <Route exact path="/invitation/:inviteID" component={InvitationPage} />
                        <Route exact path="/event/:urlID/:inviteID?" component={EventPage} />
                        <Route exact path="/account-details" component={AccountDetails} />
                        <Route exact path="/browse" component={BrowseEvents} />
                        <Route component={Error404} />
                    </Switch>
                </BrowserRouter>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        socket: state.socket
    }
}

export default connect(mapStateToProps, actions)(App);
