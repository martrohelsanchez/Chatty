const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    conversation_id: {type: Schema.Types.ObjectId, ref: 'Conversation'},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    message_body: {type: String},
    date_sent: {type: Number}
});

module.exports = model('Message', messageSchema);