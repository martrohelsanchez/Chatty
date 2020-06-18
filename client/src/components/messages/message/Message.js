import React from 'react'

import styles from './message.module.css'

function Message({message, from}) {
    return (
        <div>
            <span>
                {from}:{" "}
            </span>
            <span>
                {message}
            </span>
        </div>
    )
}

export default Message;