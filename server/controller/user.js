const jwt = require('jsonwebtoken');
const CsrfTokenGen = require('csrf');

const User = require("../model/user");

const csrfTokenGen = new CsrfTokenGen({saltLength: 8, secretLength: 18});

// POST /user/signUp
async function userSignUp(req, res) {
    try {
        const findUser = await User.findOne({ username: req.body.username })
                .exec()
        const isUserTaken = findUser === null ? false : true;

        if (!isUserTaken) {
            const user = await User.create({
                username: req.body.username
            });
            const csrfToken = csrfTokenGen.create(process.env.CSRF_TOKEN_KEY);
            const jwtToken = jwt.sign({
                userId: user._id,
                csrfToken: csrfToken
            },
                process.env.JWT_KEY
            );

            res.cookie('jwt', jwtToken, {
                httpOnly: true
            });
            res.status(200).json({
                userId: user._id,
                username: user.username,
                isUsernameTaken: false,
                csrfToken: csrfToken
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

// POST /user/logIn
async function userLogIn(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username })
            .select("-__v")
            .exec();

        if (user) {
            const csrfToken = csrfTokenGen.create(process.env.CSRF_TOKEN_KEY);
            const jwtToken = jwt.sign({
                userId: user._id,
                username: user.username,
                csrfToken: csrfToken
            },
                process.env.JWT_KEY
            );

            res.cookie('jwt', jwtToken, {
                httpOnly: true,
                sameSite: true
            });
            res.status(200).json({
                userId: user._id,
                username: user.username,
                isAuth: true,
                csrfToken: csrfToken
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

// POST /user/reAuth
async function reAuthUser(req, res) {
    try {
        const jwtToken = req.cookies.jwt;
        const decoded = jwt.verify(jwtToken, process.env.JWT_KEY);
        const csrfToken = req.headers['csrf-token'];
        
        //Verify if the csrf token was generated from the server
        if (!csrfTokenGen.verify(process.env.CSRF_TOKEN_KEY, csrfToken)) {
            throw new Error();
        }
        
        //The csrf token from req header must be the same from the token inside the jwt
        if (decoded.csrfToken !== csrfToken) {
            throw new Error();
        }

        //Generate new csrf and jwt token
        const newCsrfToken = csrfTokenGen.create(process.env.CSRF_TOKEN_KEY);
        const newJwtToken = jwt.sign({
            userId: decoded.userId,
            username: decoded.username,
            csrfToken: newCsrfToken
        },
            process.env.JWT_KEY
        );

        res.cookie('jwt', newJwtToken, {
            httpOnly: true,
            sameSite: true
        });
        res.status(200).json({
            userId: decoded.userId,
            username: decoded.username,
            isAuth: true,
            csrfToken: newCsrfToken
        });
    } catch (err) {
        console.error(err)
        res.status(403).json({
            isAuth: false
        })
    }
}

module.exports = {
    userSignUp,
    userLogIn,
    reAuthUser
}