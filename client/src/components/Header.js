import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';

class Header extends Component {
    headerClick() {
        if (this.props.auth) {
            this.props.history.push('/dashboard');
        }
        return;
    }

    logout = async () => {
        await this.props.logout();
        this.props.history.push('/login');
    }

    render() {
        const { auth, history } = this.props;
        let mql = window.matchMedia("screen and (max-width: 500px)"); 

        if (mql.matches) {
            return (
                <div className="header__container">
                    <div className="header__row">
                        <div className="header__button header__button--logo" onClick={() => history.push('/dashboard')}>event</div>
                    </div>
                    <div className="header__row header__row--buttons">
                        {auth && (<div className="header__button" onClick={() => history.push('/browse')}>Browse events</div>)}
                        {auth && (<div className="header__button" onClick={() => history.push('/create-event')}>Create event</div>)}
                        {auth && (<div className="header__button" onClick={() => history.push('/account-details')}>Account</div>)}
                        {auth && (<div className="header__button" onClick={this.logout}>Logout</div>)}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="header__container">
                    {auth && (<div className="header__button" onClick={() => history.push('/browse')}>Browse events</div>)}
                    {auth && (<div className="header__button" onClick={() => history.push('/create-event')}>Create event</div>)}
                    <div className="header__button header__button--logo" onClick={() => history.push('/dashboard')}>event</div>
                    {auth && (<div className="header__button" onClick={() => history.push('/account-details')}>Account</div>)}
                    {auth && (<div className="header__button" onClick={this.logout}>Logout</div>)}
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, actions)(withRouter(Header));
