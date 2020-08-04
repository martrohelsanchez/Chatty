const {Schema, model} = require('mongoose');

const conversationSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    group_name: {type: String},
    is_group_chat: {type: Boolean},
    members: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    conversation_pic: {type: String},
    last_message: {
        message_body: {type: String},
        sender_username: {type: String},
        date_sent: {type: Number}
    },
    is_chatroom: {type: Boolean},
    created_at: {type: Number},
    last_updated: {type: Number},
    members_meta: [
        {
            user_id: {type: Schema.Types.ObjectId, ref: 'User'},
            last_seen: {type: Number},
            delivered: {type: Boolean}
        }
    ]
});

module.exports = model('Conversation', conversationSchema); 