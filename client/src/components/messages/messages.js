import React from 'react';

import styles from './messages.module.css';
import Message from './message/Message';

function Messages() {
    return (
        <div>
            <Message from="zaira" message="pasado ka sa pup!"/>
            <Message from="rohel" message="Hala weh!"/>
        </div>
    )
}

export default Messages;