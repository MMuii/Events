import React from 'react'
import { motion } from 'framer-motion';

const DefaultButton = (props) => {
    let hoverAnimation, tapAnimation, onClickFunction;
    if (!props.inactive) {
        hoverAnimation = { y: -1.5, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.12)' };
        tapAnimation = { outline: 'none', y: 0, boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.05)' };
        onClickFunction = props.onClick;
    } else {
        hoverAnimation = {};
        tapAnimation = {};
        onClickFunction = null;
    }

    return (
        <motion.button  className={`default__button ${props.inactive ? 'inactive' : ''}`} 
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                        onClick={onClickFunction}
                        >{props.text}</motion.button> 
    )
}

export default DefaultButton;
