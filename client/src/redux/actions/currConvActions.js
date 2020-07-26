export function setCurrConv(currConv) {
    return {
        type: 'currConv/setCurrConv',
        payload: {
            currConv: currConv
        }
    }
}