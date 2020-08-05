export default function (state = {}, action) {
    const payload = action.payload;

    switch (action.type) {
        case 'currConv/setCurrConv':
           return payload.currConv 
        default:
            return state;
    }
}