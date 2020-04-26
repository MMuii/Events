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

// import socketIOClient from 'socket.io-client';

class App extends Component {
    async componentDidMount() {
        await this.props.fetchUser();

        // this.props.websocketConnect('http://localhost:5000');

        // const socket = socketIOClient('http://localhost:5000');
        // console.log(socket);
        // socket.emit('test');
    }

    render() {
        if (this.props.auth == null) { //gdy jeszcze nie wiadomo czy user jest zalogowany
            return (
                <div>Loading</div>
            )
        }

        if (this.props.auth == false) {
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
                    <Footer />
                </BrowserRouter>
            </div>
            )
        }

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
                    <Footer />
                </BrowserRouter>
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
