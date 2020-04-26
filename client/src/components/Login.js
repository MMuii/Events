import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../actions';
// import { newPopup }  from './popups/newPopup';

class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    componentDidMount() {
        const { auth, history } = this.props;

        if (auth != false && auth != null) {
            history.push('/dashboard');
        }
    }

    handleChange = ({ target: { id, value }}) => {
        this.setState({ [id]: value });
    }
    
    loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        const { fetchUser, history } = this.props;

        if (email.length < 1) {
            this.props.newPopup('error', 'Enter your email', 1500);
            return;
        }
        
        if (password.length < 1) {
            this.props.newPopup('error', 'Enter your password', 1500);
            return;
        }

        const res = await axios.post('/api/login', {
            email: email,
            password: password
        });
        
        console.log('res z logowania: ', res);
        if (res.data._id) {
            await fetchUser();
            if (this.props.callback) {
                this.props.callback();
            } else {
                history.push('/dashboard');
            }
            // history.push('/dashboard');
        } else {
            this.props.newPopup('error', 'Email or password incorrect', 1500);
        }
    }

    render() {
        return (
            <div className="auth__background">
                <div className="auth__wrapper--inner">
                    <div className="auth__h1">Login</div>
                    <form onSubmit={this.loginUser}>
                        <div className="auth__input-wrapper">
                            <input id="email" type="text" placeholder="email" className="auth__input-field" value={this.state.email} onChange={(e) => this.handleChange(e)}/>
                        </div>
                        <div className="auth__input-wrapper">
                            <input id="password" type="password" placeholder="password" className="auth__input-field" value={this.state.password} onChange={(e) => this.handleChange(e)}/>
                        </div>
                        <motion.button type="submit" 
                                        className="auth__button" 
                                        whileHover={{ y: -1.5, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.12)' }}
                                        whileTap={{ outline: 'none', y: 0, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.05)' }}
                                        >Login</motion.button>
                    </form>
                    <div className="auth__register-text" onClick={this.props.showRegister}>Create new account</div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        popups: state.popups
    }
}

export default connect(mapStateToProps, actions)(withRouter(Login));
