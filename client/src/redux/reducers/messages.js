// [
//     {
//         convId: 'ID',
//         messages: [
//             {}
//         ]
//     }
// ]


export default function(state = [], action) {
    const newState = [...state];
    const payload = action.payload;

    switch (action.type) {
        case 'messages/setInitialMessages':
            newState.push({
                convId: payload.convId,
                messages: payload.initialMsgs
            })
            return newState;
        case 'messages/addedNewMessage':
            return newState.map((conv, i) => {
                if (conv.convId === payload.convId) {
                    return {
                        convId: payload.convId,
                        messages: [
                            ...conv.messages,
                            payload.newMsg
                        ]
                    }
                }
                return conv;
            })
        case 'messages/addedPreviousMessages':
            console.log('------------------')
            console.log('messages reducers')
            console.log(payload.prevMsgs)
            console.log('--------------------')
            return newState.map(conv => {
                if (conv.convId === payload.convId) {
                    return {
                        convId: payload.convId,
                        messages: [
                            ...payload.prevMsgs,
                            ...conv.messages
                        ]
                    }
                }
                return conv;
            })
        default:
            return state;
    }
}