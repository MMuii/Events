import React, { Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
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
        const variants = {
            loggedIn: {
                top: 0,
                transition: {
                    staggerChildren: 0.1
                }
            },
            loggedOut: {
                top: 260,
                transition: {
                    staggerChildren: 0.1
                }
            }
        }

        const variantsChild = {
            loggedIn: {
                scale: 1,
                opacity: 1
            },
            loggedOut: {
                scale: 0.8,
                opacity: 0
            }
        }

        const { auth, history } = this.props;
        
        return (
            <div className="header__container">
                    {/* {this.props.auth && (<div className="header__button" onClick={() => this.props.history.push('/dashboard')}>Dashboard</div>)} */}
                    {auth && (<div className="header__button" onClick={() => history.push('/browse')}>Browse events</div>)}
                    {auth && (<div className="header__button" onClick={() => history.push('/create-event')}>Create event</div>)}
                    <div className="header__button header__button--logo" onClick={() => history.push('/dashboard')}>event</div>
                    {/* {auth && (<div className="header__button" onClick={() => history.push('/dashboard')}>Test</div>)} */}
                    {auth && (<div className="header__button" onClick={() => history.push('/account-details')}>Account</div>)}
                    {auth && (<div className="header__button"
                                              onClick={this.logout}>Logout</div>)}
            </div>
            // <motion.div className="header__container"
            //             variants={variants}
            //             initial={this.props.auth ? "loggedIn" : "loggedOut"}
            //             animate={this.props.auth ? "loggedIn" : "loggedOut"}>
            //     <AnimatePresence>
            //         {this.props.auth && (<motion.div className="header__button"
            //                      key="1"
            //                      variants={variantsChild}
            //                      exit="loggedOut"
            //                      transition={{duration: 0.05}}>Dashboard</motion.div>)}
            //         {this.props.auth && (<motion.div className="header__button"
            //                      key="2"
            //                      variants={variantsChild}
            //                      exit="loggedOut"
            //                      transition={{duration: 0.05}}>Browse events</motion.div>)}
            //         <motion.div className="header__button header__button--logo"
            //                     onClick={this.logoClick}>event</motion.div>
            //         {this.props.auth && (<motion.div className="header__button"
            //                      key="3"
            //                      variants={variantsChild}
            //                      exit="loggedOut"
            //                      transition={{duration: 0.05}}>Account</motion.div>)}
            //         {this.props.auth && (<motion.div className="header__button"
            //                      key="4"
            //                      variants={variantsChild}
            //                      exit="loggedOut"
            //                      transition={{duration: 0.05}}>Logout</motion.div>)}
            //     </AnimatePresence>
            // </motion.div>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, actions)(withRouter(Header));
