import React from 'react';

import ContactsPane from './components/contactsPane';
import MessagePane from './components/messagesPane';

function App() {
    return (
        <div>
            <ContactsPane />
            <MessagePane />
        </div>
    )
}

export default App;