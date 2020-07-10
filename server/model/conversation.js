const {Schema, model} = require('mongoose');

const conversationSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    conversation_name: {type: String},
    members: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    conversation_pic: {type: String},
    last_message: {
        message_body: {type: String},
        sender_username: {type: String}
    },
    is_chatroom: {type: Boolean},
    created_at: {type: Number},
    last_updated: {type: Number}
});

module.exports = model('Conversation', conversationSchema); 