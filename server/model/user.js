const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    recentMessages: [
        {
            kausap: {type: String},
            messages: [
                {
                    from: {type: String},
                    message: {type: String}
                }
            ]
        }
    ]
})

module.exports = mongoose.model('Users', userSchema);