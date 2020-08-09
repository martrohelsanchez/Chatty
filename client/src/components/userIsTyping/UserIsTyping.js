import React, { useEffect, useState } from 'react';

import styles from './userIsTyping.module.css';
import { socket } from '../../App';

import { useSelector } from 'react-redux';

// import findConv from '../../utilities/findConv';

function UserIsTyping() {
    const currConvId = useSelector(state => state.currConv._id);
    const [isTyping, setIsTyping] = useState(false);
    const [numOfTyping, setNumOfTyping] = useState(0);

    useEffect(() => {
        return () => {
            setIsTyping(0);
            setIsTyping(false);
        }
    }, [currConvId]);

    useEffect(() => {
        socket.on('startTyping', () => {
            setNumOfTyping(prev => prev + 1);
            setIsTyping(true);
        })

        socket.on('stopTyping', () => {
            setNumOfTyping(prev => prev - 1);

            if (numOfTyping === 0) {
                setIsTyping(false);
            }
        }) 
    }, []);

    return isTyping && (
        <div>
            Typing...
        </div>
    )
}

export default UserIsTyping;