const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    message_body: {type: String},
    date_sent: {type: Number},
    conversation_id: {type: Schema.Types.ObjectId, ref: 'Conversation'}
});

module.exports = model('Message', messageSchema);