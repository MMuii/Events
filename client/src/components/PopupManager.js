import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../actions';
import Popup from './Popup';
import { AnimatePresence } from 'framer-motion';

class PopupManager extends Component {
    renderPopups() {
        console.log('RERENDERED POPUPS');
        const popups = this.props.popups.map((popup, id) => {
            return <Popup type={popup.type} msg={popup.msg} key={id} /> 
            // switch (popup.type) {
            //     case 'success':
            //         return <Popup type={popup.type} msg={popup.msg} key={id}/>
            //     case 'error':
            //         return <Popup type={popup.type} msg={popup.msg} key={id}/>
            // }
        });

        return popups;
    }

    render() {
        return (
            <AnimatePresence>
                {this.renderPopups()}
            </AnimatePresence>
        )
    }
}

function mapStateToProps(state) {
    return {
        popups: state.popups
    }
}

export default connect(mapStateToProps, actions)(PopupManager);