import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import Login from './Login';
import Register from './Register';
import PopupManager from './PopupManager';


class AuthPage extends Component {
    state = {
        showRegister: false,
    }

    componentDidMount() {
        if (this.props.redirectAfterLogin) {
            this.setState({ redirectAfterLogin: this.props.redirectAfterLogin });
        }
    }

    newPopup = (type, msg, time) => {
        this.props.showPopup(type, msg);
    
        setTimeout(() => {
            this.props.hidePopup();
        }, time);
    }

    renderContent() {
        if (this.state.showRegister) {
            return <Register showLogin={() => this.setState({ showRegister: false })} 
                             newPopup={this.newPopup}/>
        } 
        return <Login showRegister={() => this.setState({ showRegister: true })} 
                      newPopup={this.newPopup} callback={this.props.callback} />
    }

    async getCurrentUser() {
        const res = await axios.get('/api/current_user');
        console.log('current user: ', res);
    }

    render() {
        return (<>
                <PopupManager />
                <div className="auth__wrapper--outer">
                    {this.renderContent()}
                    {this.props.showBackButton && <div className="auth__go-back" onClick={this.props.hideLoginForm}>Go back to event</div>}
                </div></>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        authForm: state.authForm,
        popups: state.popups
    }
}

export default connect(mapStateToProps, actions)(withRouter(AuthPage));