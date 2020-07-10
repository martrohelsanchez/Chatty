import React, { useState } from 'react';
import axios from 'axios';

function ConversationList() {
    const [conversations, setConversations] = useState([]);

    function getConversations() {
        axios.get('')
    }
}

export default ConversationList