import React from 'react'

import styles from './message.module.css'

function Message({message}) {
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

// function Message({message}) {
//     const {message_body, sender} = message

//     return (
//         <div>
//             <span>
//                 {sender.username}:{" "}
//             </span>
//             <span>
//                 {message_body}
//             </span>
//         </div>
//     )
// }

export default Message;