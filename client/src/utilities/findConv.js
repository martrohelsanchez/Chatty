function findConv(state, select) {
    const conv = state.conversations.find(conv => conv._id === state.currConv._id);
    return conv ? conv[select] : []
};

export default findConv;