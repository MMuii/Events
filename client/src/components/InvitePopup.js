import React, { Component } from 'react'
import { motion } from 'framer-motion';

class InvitePopup extends Component {
    state = {
        buttonText: 'Copy to clipboard'
    }

    copyToClipboard = () => {
        const copyText = document.getElementById('inviteURL');
        copyText.select();
        copyText.setSelectionRange(0, 10000);
        document.execCommand('copy');
        this.setState({ buttonText: 'Copied!' }, () => {
            setTimeout(() => {
                this.setState({ buttonText: 'Copy to clipboard' });
            }, 2000);
        })
    }

    render() {
        return (
            <div className="invite-popup__dim-layer">
                <div className="invite-popup__container">
                    <div className="invite-popup__container--inner">
                        <div className="invite-popup__link-container">
                            <div className="default__component-header">Invite to event</div>
                            <div className="default__input-label">Share link from below to invite to event</div>
                            <div className="invite-popup__link-input-container">
                                <button onClick={this.copyToClipboard}>{this.state.buttonText}</button>
                                <input id="inviteURL" className="default__input-field" type="text" value={`localhost:3000/invitation/${this.props.inviteID}`}/>
                            </div>
                        </div>
                        <motion.button 
                            whileHover={{ y: -1.5, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.12)' }}
                            whileTap={{ outline: 'none', y: 0, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.05)' }}
                            className="default__button margin-top--2" 
                            onClick={this.props.close}>Close</motion.button>
                    </div>
                </div>
            </div>
        )
    }
}

export default InvitePopup;
