import React from 'react'

import styles from './message.module.css'

function Message({message, msgIndex, allMsg}) {
    const {message_body, sender} = message

    return (
        <div>
            <span>
                {sender.username}:{" "}
            </span>
            <span>
                {message_body}
            </span>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    )
}
export default Message;