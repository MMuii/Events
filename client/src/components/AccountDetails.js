import React, { Component } from 'react';
import { ReactComponent as EditIcon } from '../icons/edit-icon.svg';
import DefaultButton from '../components/reusable/DefaultButton';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import * as actions from '../actions';

class AccountDetails extends Component {
    state = {
        nickname: {
            initial: '',
            text: '',
            disabled: true
        },
        email: {
            initial: '',
            text: '',
            disabled: true
        },
        password: {
            initial: '************',
            text: '************',
            disabled: true
        },
        confirmPassword: {
            text: ''
        },
        message: ''
    }

    componentDidMount() {
        const { nickname, email } = this.props.auth;

        if (this.props.auth) {
            this.setState({ nickname: { ...this.state.nickname, 
                                        initial: nickname,  
                                        text: nickname }, 
                            email: { ...this.state.email, 
                                     initial: email, 
                                     text: email } });
        } else {
            this.props.history.push('/login');
        }
    }

    handleChange = ({ target: { id, value }}) => {
        this.setState({ [id]: { ...this.state[id], text: value } });
    }

    enableEditing(field) {
        if (field == 'password') {
            const isDisabled = this.state.password.disabled;
            const text = isDisabled ? '' : '************';

            this.setState({ password: { ...this.state.password,
                                        text: text, 
                                        disabled: !isDisabled },
                            confirmPassword: { text: text } });
        } else {
            this.setState(prevState => {
                return { [field]: { ...this.state[field], 
                                    text: prevState[field].initial,
                                    disabled: !prevState[field].disabled, } }
            });
        }
    }

    validateNickname() {
        const { nickname } = this.state;

        if (nickname.text.length < 4) {
            alert('Nickname must consist of at least 4 characters');
            // this.props.showPopup('errorMsg', 'Nickname must consist of at least 4 characters');
            return false;
        }

        if (nickname.text.length > 16) {
            alert('Nickname must consist of max 16 characters');
            // this.props.showPopup('errorMsg', 'Nickname must consist of max 16 characters');
            return false;
        }

        return true;
    }

    validateEmail() {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.state.email.text).toLocaleLowerCase());
    }

    validatePassword() {
        const { password, confirmPassword } = this.state;
        const reUppercase = /^(?=.*[a-z])(?=.*[A-Z])/;
        const reLength = /^.{7,}$/;

        if (password.text.length < 1) {
            alert('Enter new password');
            // this.props.showPopup('errorMsg', 'Enter the password');
            return false;
        }

        if (confirmPassword.text.length < 1) {
            alert('Confirm your password');
            // this.props.showPopup('errorMsg', 'Confirm your password');
            return false;
        }

        if (!reUppercase.test(password.text)) {
            alert('Password must contain at least 1 uppercase and lowercase character');
            // this.props.showPopup('errorMsg', 'Password must contain at least 1 uppercase and lowercase character')
            return false;
        }

        if (!reLength.test(password.text)) {
            alert('Password must be at least 7 characters length');
            // this.props.showPopup('errorMsg', 'Password must be at least 7 characters length')
            return false;
        }

        if (password.text !== confirmPassword.text) {
            alert('Password and confirmed password doesn\`t match');
            return false;
        }

        return true;
    }

    save = async () => {
        const { nickname, password, email } = this.state; 
        let changedNick = false, changedEmail = false, changedPassword = false;
        console.log('state account details: ', this.state);

        if (nickname.initial != nickname.text) {
            if (this.validateNickname()) {
                try {
                    await axios.post('/api/change_nickname', { newNickname: nickname.text });
                    changedNick = true;
                    console.log('Changed nick');
                    // this.props.updateNickname();
                } catch (err) {
                    alert(`Error while changing nickname: ${err}`);
                }
            }
        }

        if (email.initial != email.text) {
            if (this.validateEmail()) {
                try {
                    await axios.post('/api/change_email', { newEmail: email.text });
                    changedEmail = true;
                    console.log('Changed email');
                } catch (err) {
                    alert(`Error while changing email: ${err}`);
                }
            }
        }

        if (password.initial != password.text) {
            if (this.validatePassword()) {
                try {
                    await axios.post('/api/change_password', { newPassword: password.text});
                    changedPassword = true;
                    console.log('Changed password');
                } catch (err) {
                    alert(`Error while changing password: ${err}`);
                }
            }
        }

        if (changedNick || changedEmail || changedPassword) {
            const newNick = changedNick ? this.state.nickname.text : this.state.nickname.initial;
            const newEmail = changedEmail ? this.state.email.text : this.state.email.initial;
            const newPassword = changedPassword ? this.state.password.text : this.state.password.initial;

            this.setState({ nickname: { initial: newNick,
                                        text: newNick,
                                        disabled: true },
                            email: { initial: newEmail,
                                     text: newEmail,
                                     disabled: true },
                            password: { initial: newPassword, 
                                        text: newPassword,
                                        disabled: true },
                            message: 'Saved'}, () => {
                                setTimeout(() => {
                                    this.setState({ message: '' });
                                }, 2500);
                            });
        }

    }

    render() {
        const { nickname, email, password, confirmPassword } = this.state;
        const btnInactive = (nickname.initial != nickname.text ||
                             email.initial != email.text ||
                             password.initial != password.text) ? false : true;

        return (
            <div className="acc-details default__component-container">
                <div className="default__component-container--inner acc-details__container">
                    <div className="default__component-header">Account details</div>
                    <div className="default__input-label">
                        Nickname 
                        <EditIcon className="acc-details__icon" onClick={() => this.enableEditing('nickname')}/>
                    </div>
                    <input type="text" 
                           className={`default__input-field acc-details__input-field ${!nickname.disabled && 'acc-details__input-field--enabled'}`}
                           value={nickname.text} 
                           disabled={nickname.disabled}
                           id="nickname"
                           onChange={(e) => this.handleChange(e)}/>
                    <div className="default__input-label">
                        Email
                        <EditIcon className="acc-details__icon" onClick={() => this.enableEditing('email')}/>
                    </div>
                    <input type="text" 
                           className={`default__input-field acc-details__input-field ${!email.disabled && 'acc-details__input-field--enabled'}`}
                           value={email.text} 
                           disabled={email.disabled}
                           id="email"
                           onChange={(e) => this.handleChange(e)}/>
                    <div className="default__input-label">
                        {password.disabled ? 'Password' : 'New password'}
                        <EditIcon className="acc-details__icon" onClick={() => this.enableEditing('password')}/>
                    </div>
                    <input type="password" 
                           className={`default__input-field acc-details__input-field ${!password.disabled && 'acc-details__input-field--enabled'}`}
                           value={password.text}
                           disabled={password.disabled}
                           id="password"
                           onChange={(e) => this.handleChange(e)}/>
                    {!this.state.password.disabled && <>
                    <div className="default__input-label">Confirm new password</div>
                    <input type="password" 
                           className={`default__input-field acc-details__input-field acc-details__input-field--enabled`}
                           value={confirmPassword.text} 
                           id="confirmPassword"
                           onChange={(e) => this.handleChange(e)}/></>}
                    <div className="acc-details__save-container"> 
                        <DefaultButton text="Save" 
                                       className="acc-details__save-button" 
                                       onClick={() => this.save()} 
                                       inactive={btnInactive}/>
                        <span className="acc-details__save-info">{this.state.message}</span>
                    </div>

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

export default connect(mapStateToProps, actions)(withRouter(AccountDetails));
