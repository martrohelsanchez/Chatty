const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    seen: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    is_sent: {type: Boolean},
    is_delivered: {type: Boolean},
    date_sent: {type: Number}
});

module.exports = model('Message', messageSchema);