const jwt = require('jsonwebtoken');

const User = require("../model/user");

async function userSignUp(req, res) {
    try {
        const findUser = await User.findOne({ username: req.body.username })
                .exec()
        const isUserTaken = findUser === null ? false : true;

        if (!isUserTaken) {
            const user = await User.create({
                username: req.body.username
            })

            const jwtToken = jwt.sign({
                userId: user._id
            },
                process.env.JWT_KEY
            );

            res.status(200).json({
                username: user.username,
                isUsernameTaken: false,
                jwtToken
            })
        } else {
            //user is already taken
            res.status(200).json({
                isUsernameTaken: true
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        })
    }
}

async function userLogIn(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username })
            .select("-__v")
            .exec();

        if (user) {
            const jwtToken = jwt.sign({
                userId: user._id
            },
                process.env.JWT_KEY
            );

            res.status(200).json({
                _id: user._id,
                username: user.username,
                isAuth: true,
                jwtToken
            });
        } else {
            res.status(401).json({
                isAuth: false,
            });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        })
    }
}

module.exports = {
    userSignUp,
    userLogIn
}