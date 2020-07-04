const {Schema, model} = require('mongoose');

// const userSchema = Schema({
//     username: {type: String, required: true},
//     conversations: [
//         {
//             kausap: {type: String},
//             messages: [
//                 {
//                     from: {type: String},
//                     message: {type: String}
//                 }
//             ]
//         } 
//     ]
// });

const userSchema = Schema({
    email: {type: String},
    username: {type: String},
    password: {type: String},
    conversations: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ]
});

module.exports = model('User', userSchema);