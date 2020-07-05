const {Schema, model} = require('mongoose');

const conversationSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    conversation_name: {type: String},
    members: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    messages: {type: Schema.Types.ObjectId, ref: 'Message'},
    conversation_pic: {type: String},
    created_at: {type: Number},
    last_updated: {type: Number}
});

module.exports = model('Conversation', conversationSchema); 