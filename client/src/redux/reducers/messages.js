const initialState = [];

// [
//     {
//         convId: 'ID',
//         messages: [
//             {}
//         ]
//     }
// ]


export default function(state = initialState, action) {
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
                    conv.messages.push(payload.newMsg)
                }
                return conv;
            })
        case 'messages/addedPreviousMessages':
            return newState.map(conv => {
                if (conv.convId === payload.convId) {
                    conv.messages.unshif(payload.prevMsgs)
                }
                return conv;
            })
        default:
            return state;
    }
}