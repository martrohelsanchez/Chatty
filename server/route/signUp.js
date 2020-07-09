const User = require('../model/user');

function userSignUp(req, res) {
    User.findOne({ username: req.body.username })
        .exec()
        .then(user => {
            if (!user) {
                //User doesn't exist yet
                User.create({
                    username: req.body.username
                })
                    .then(user => {
                        res.status(200).json({
                            username: user.username,
                            conversations: user.conversations,
                            isUsernameTaken: false,
                        });
                    })
            } else {
                //user is already taken
                res.status(200).json({
                    isUsernameTaken: true
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })
}

// router.post('/', (req, res, next) => {
//     User.findOne({username: req.body.username})
//         .exec()
//         .then(user => {
//             if (!user) {
//                 //User doesn't exist yet
//                 User.create({
//                     username: req.body.username
//                 })
//                     .then(user => {
//                         res.status(200).json({
//                           username: user.username,
//                           conversations: user.conversations,
//                           isUsernameTaken: false,
//                         });
//                     })
//             } else {
//                 //user is already taken
//                 res.status(200).json({
//                     isUsernameTaken: true
//                 })
//             }
//         })
//         .catch(err => {
//             res.status(500).json({
//                 err: err
//             })
//         })
// })

module.exports = {userSignUp};