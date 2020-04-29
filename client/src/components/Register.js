import React, { Component } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

class Register extends Component {
    state = {
        nickname: '',
        email: '',
        password: '',
        password2: ''
    }

    handleChange = ({ target: { id, value }}) => {
        this.setState({ [id]: value });
    }

    validateNickname() {
        const { nickname } = this.state;

        if (nickname.length > 0 && nickname.length < 4) {
            this.props.newPopup('error', 'Nickname must consist of at least 4 characters', 1500);
            return false;
        }

        if (nickname.length > 16) {
            this.props.newPopup('error', 'Nickname must consist of max 16 characters', 1500);
            return false;
        }

        return true;
    }

    validateEmail() {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.state.email).toLocaleLowerCase());
    }

    validatePassword() {
        const { password, password2 } = this.state;
        const reUppercase = /^(?=.*[a-z])(?=.*[A-Z])/;
        const reLength = /^.{7,}$/;

        if (password.length < 1) {
            this.props.newPopup('error', 'Enter the password', 1500);
            return false;
        }

        if (password2.length < 1) {
            this.props.newPopup('error', 'Confirm your password', 1500);
            return false;
        }

        if (!reUppercase.test(password)) {
            this.props.newPopup('error', 'Password must contain at least 1 uppercase and lowercase character', 1500);
            return false;
        }

        if (!reLength.test(password)) {
            this.props.newPopup('error', 'Password must be at least 7 characters length', 1500);
            return false;
        }

        if (password !== password2) {
            return false;
        }

        return true;
    }

    registerNewUser = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        let { nickname } = this.state;
        const { showLogin } = this.props;

        if (!this.validateNickname()) {
            return;
        }

        if (!this.validateEmail()) {
            this.props.newPopup('error', 'Incorrect email!', 1500);
            return;
        }

        if (!this.validatePassword()) {
            return;
        }

        if (nickname.length == 0) {
            nickname = 'user_' + _.times(8, () => _.random(35).toString(36)).join('');
            console.log('creating account with anonymous nickname: ', nickname);
        }

        const res = await axios.post('/api/register', {
            nickname,
            email,
            password
        });

        const { error, message } = res.data;
        console.log('ERROR:', error);

        if (error == true) {
            this.props.newPopup('error', message, 1500);
            this.setState({ email: '', password: '', password2: '' });
        } else if (error == false) {
            this.setState({ email: '', password: '', password2: '' });
            this.props.newPopup('success', message, 1500);
            showLogin();
        }
    }

    render() {
        return (
            <div className="auth__background">
                <div className="auth__wrapper--inner">
                    <div className="auth__h1">Register</div>
                    <form onSubmit={this.registerNewUser}>
                        <div className="auth__input-wrapper">
                            <input id="nickname" type="text" placeholder="nickname" className="auth__input-field" value={this.state.nickname} onChange={(e) => this.handleChange(e)}/>
                        </div>
                        <div className="auth__input-wrapper auth__input-wrapper--email">
                            <input id="email" type="text" placeholder="email" className="auth__input-field" value={this.state.email} onChange={(e) => this.handleChange(e)}/>
                        </div>
                        <div className="auth__input-wrapper auth__input-wrapper--password">
                            <input id="password" type="password" placeholder="password" className="auth__input-field" value={this.state.password} onChange={(e) => this.handleChange(e)}/>
                        </div>
                        <div className="auth__input-wrapper auth__input-wrapper--confirm-password">
                            <input id="password2" type="password" placeholder="confirm password" className="auth__input-field" value={this.state.password2} onChange={(e) => this.handleChange(e)}/>
                        </div>
                        <div className="auth__necessary-info">Fields marked with <span>*</span> are necessary</div>
                        <motion.button type="submit" 
                                        className="auth__button" 
                                        whileHover={{ y: -1.5, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.12)' }}
                                        whileTap={{ outline: 'none', y: 0, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.05)' }}
                                        >Register</motion.button>
                    </form>
                    <div className="auth__register-text" onClick={this.props.showLogin}>Already have an account? <span>Login</span></div>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);
