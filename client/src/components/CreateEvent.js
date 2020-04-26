import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-autosize-textarea';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as LockIcon } from '../icons/lock-icon.svg';
import { ReactComponent as PublicIcon } from '../icons/public-icon.svg';

class CreateEvent extends Component {
    state = {
        title: {
            error: '',
            text: '',
            isOk: false
        },
        shortDescription: {
            error: '',
            text: '',
            isOk: false
        },
        content: {
            error: '',
            text: '',
            isOk: false
        }, 
        isPublic: true,
        eventDate: {
            date: new Date(),
            error: '',
            isOk: false
        }
    }

    validateDate() {
        const currentDate = new Date(); 
        if (this.state.eventDate.date <= currentDate) {
            this.setState({ eventDate: { ...this.state.eventDate, error: 'Select date greater than current!', isOk: false}});
            return true;
        } else {
            this.setState({ eventDate: { ...this.state.eventDate, isOk: true }});
            return false;
        }
    }

    validate() {
        let errorOccured = false;

        if (this.state.title.text.length < 5) {
            this.setState({ title: { ...this.state.title, error: 'Title must be at least 5 characters long!', isOk: false }});
            errorOccured = true;
        }

        if (this.state.shortDescription.text.length < 10) {
            this.setState({ shortDescription: { ...this.state.shortDescription, error: 'Title must be at least 10 characters long!', isOk: false }});
            errorOccured = true;
        }

        if (this.state.content.text.length < 20) {
            this.setState({ content: { ...this.state.content, error: 'Content must be at least 20 characters long!', isOk: false }});
            errorOccured = true;
        }

        if (this.validateDate()) errorOccured = true;

        console.log(this.state);
        return errorOccured;
    }

    submit = async (e) => {
        e.preventDefault();

        if (!this.validate()) {
            const { title, shortDescription, content, eventDate, isPublic } = this.state;
            const inviteID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const urlID = Math.random().toString(36).substring(2, 15);

            await this.props.createEvent(title.text, shortDescription.text, content.text, eventDate.date, isPublic, inviteID, urlID);
            this.newPopup('success', 'Event created!', 1500);
            this.props.history.push('/dashboard');
        }
    }

    newPopup = (type, msg, time) => {
        this.props.showPopup(type, msg);
    
        setTimeout(() => {
            this.props.hidePopup();
        }, time);
    }

    handleChange = ({ target: { id, value }}) => {
        let isOk = false;
        const { title, shortDescription, content } = this.state;

        switch (id) {
            case 'title':
                if (value.length >= 5 && !title.error) isOk = true;
                break;
            case 'shortDescription':
                if (value.length >= 10 && !shortDescription.error) isOk = true;
            case 'content':
                if (value.length >= 20 && !content.error) isOk = true;
                break;
            default:
                break;
        }

        this.setState({ [id]: { text: value,
                                error: '',
                                isOk: isOk }
        });
    }

    handleDateChange = date => {
        this.setState({ eventDate: { ...this.state.eventDate, date: date, error: '' }}, () => {
            this.validateDate();
        });
    }

    handleAvailabilityChange = (e) => {
        switch (e.target.value) {
            case 'public':
                this.setState({ isPublic: true });
                break;
            case 'private':
                this.setState({ isPublic: false });
                break;
            default: break;
        }
    }

    render() {
        return (
            <div className="default__component-container">
                <div className="default__component-container--inner">
                    <div className="default__component-header" onClick={() => console.log(this.state)}>Create new event</div>
                    <form className="default__form" onSubmit={(e) => this.submit(e)}>
                        {/* TITLE */}
                        <div className="default__input-wrapper">
                            <div className="default__input-label-container">
                                <div className="default__input-label">Title {this.state.title.isOk && <span className="default__input-checkmark">✔</span>}</div>
                                <div className="default__input-error">{this.state.title.error}</div>
                            </div>
                            <input id="title" type="text" placeholder="Title" className="default__input-field" value={this.state.title.text} onChange={(e) => this.handleChange(e)}/>
                        </div>
                        {/* SHORT DESCRIPTION */}
                        <div className="default__input-wrapper">
                            <div className="default__input-label-container">
                                <div className="default__input-label">Short description {this.state.shortDescription.isOk && <span className="default__input-checkmark">✔</span>}</div>
                                <div className="default__input-error">{this.state.shortDescription.error}</div>
                            </div>
                            <TextareaAutosize id="shortDescription" 
                                              placeholder="Add your event's short description" 
                                              rows="3"
                                              className="default__input-field default__input-field--textarea" 
                                              value={this.state.shortDescription.text} 
                                              onChange={(e) => this.handleChange(e)}/>
                        </div>
                        {/* CONTENT */}
                        <div className="default__input-wrapper">
                            <div className="default__input-label-container">
                                <div className="default__input-label">Content {this.state.content.isOk && <span className="default__input-checkmark">✔</span>}</div>
                                <div className="default__input-error">{this.state.content.error}</div>
                            </div>
                            <TextareaAutosize id="content" 
                                              placeholder="Add your event's content" 
                                              rows="8"
                                              className="default__input-field default__input-field--textarea" 
                                              value={this.state.content.text} 
                                              onChange={(e) => this.handleChange(e)}/>
                        </div>
                        {/* DATE */}
                        <div className="default__input-wrapper">
                            <div className="default__input-label-container">
                                <div className="default__input-label">Date {this.state.eventDate.isOk && <span className="default__input-checkmark">✔</span>}</div>
                                <div className="default__input-error">{this.state.eventDate.error}</div>
                            </div>
                            <DatePicker className="default__input-field datepicker" id="date" selected={this.state.eventDate.date} onChange={this.handleDateChange} autoComplete="off" showTimeSelect dateFormat="Pp"/>
                        </div>
                        {/* IS EVENT PUBLIC OR NOT */}
                        <div className="default__input-wrapper">
                            <div className="default__input-label-container">
                                <div className="default__input-label">Availability <span className="default__input-checkmark">✔</span></div>
                            </div>
                            <div className="default__input-radio-container">
                                <div className="default__input-radio-container--inner">
                                    <input type="radio" 
                                           name="availability" 
                                           value="public" 
                                           className="default__input-radio-button" 
                                           checked={this.state.isPublic === true} 
                                           onChange={this.handleAvailabilityChange}/>
                                    <PublicIcon className="default__input-radio-icon default__input-radio-icon--public"/>
                                    <div className="default__input-radio-label">
                                        <div>Public</div>
                                        <div>Everyone can see and join your event</div>
                                    </div>
                                </div>
                                <div className="default__input-radio-container--inner">
                                    <input type="radio" 
                                           name="availability" 
                                           value="private" 
                                           className="default__input-radio-button" 
                                           checked={this.state.isPublic === false} 
                                           onChange={this.handleAvailabilityChange}/>
                                    <LockIcon className="default__input-radio-icon default__input-radio-icon--lock"/>
                                    <div className="default__input-radio-label">
                                        <div>Private</div>
                                        <div>Only users with invitation can see and join your event</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SUBMIT BUTTON */}
                        <motion.button type="submit" 
                                        className="default__button margin-top--3" 
                                        whileHover={{ y: -1.5, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.12)' }}
                                        whileTap={{ outline: 'none', y: 0, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.05)' }}
                                        >Create</motion.button>   
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(null, actions)(withRouter(CreateEvent));