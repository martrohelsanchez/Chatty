import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { socket } from '../../App';

function UserIsTyping({isTyping, setIsTyping}) {
    const match = useRouteMatch<{convId: string}>();
    const currConvId = match.params.convId;
    const [numOfTyping, setNumOfTyping] = useState(0);

    useEffect(() => {
        return () => {
            setIsTyping(0);
            setIsTyping(false);
        }
    }, [currConvId, setIsTyping]);

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
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isTyping && (
        <div>
            Typing...
        </div>
    )
}

export default UserIsTyping;