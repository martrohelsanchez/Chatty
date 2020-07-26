export default function (state = null, action) {
    const payload = action.payload;

    switch (action.type) {
        case 'currConv/setCurrConv':
           return payload.currConv 
        default:
            return state;
    }
}