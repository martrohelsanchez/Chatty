const jwt = require('jsonwebtoken');

const User = require("../model/user");

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

async function userLogIn(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username })
            .select("-__v")
            .exec();

        if (user) {
            const token = jwt.sign({
                userId: user._id
            },
                process.env.JWT_KEY
            );

            res.status(200).json({
                _id: user._id,
                username: user.username,
                conversations: user.conversations,
                isAuth: true,
                token
            });
        } else {
            res.status(401).json({
                isAuth: false,
            });
        }
    } catch (err) {
        res.status(200).json({
            err
        })
    }
}

module.exports = {
    userSignUp,
    userLogIn
}