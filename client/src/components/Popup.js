import React from 'react'
import { motion } from 'framer-motion';

const Popup = (props) => {
    const msg = () => {
        console.log('type popupa: ', props.type);
        if (props.type == 'success') {
            return <div className="default__popup default__popup-msg--ok">{props.msg}</div>
        } else if (props.type == 'error') {
            return <div className="default__popup default__popup-msg--error"><span>Error:&nbsp;</span>{props.msg}</div>
        }
    }

    return (
            <motion.div className="default__popup-container">
                <motion.div className="default__popup"
                            initial={{y: -90}}
                            animate={{y: 15}}
                            exit={{y: -90, transition: { duration: 0.2 }}}
                            positionTransition>
                    {msg()}
                </motion.div>
            </motion.div>
    )
}

export default Popup;
