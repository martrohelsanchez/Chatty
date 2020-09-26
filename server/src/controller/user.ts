import jwt from 'jsonwebtoken';
import CsrfTokenGen from 'csrf';
import {Request, Response} from 'express';

import User from '../model/user';
import LastSeen from '../model/lastSeen';
import {IJwtDecoded} from '../shared/types';

const csrfTokenGen = new CsrfTokenGen({saltLength: 8, secretLength: 18});

// POST /user/signUp
async function userSignUp(req: Request, res: Response) {
    try {
        const findUser = await User
                .findOne({ username: req.body.username })
                .exec()
        const isUserTaken = findUser === null ? false : true;

        if (!isUserTaken) {
            const user = await User.create({
                username: req.body.username,
                password: req.body.password,
                profile_pic: 'https://smhlancers.org/wp-content/uploads/2016/06/profile-placeholder.png'
            });
            const csrfToken = csrfTokenGen.create(process.env.CSRF_TOKEN_KEY);
            const jwtToken = jwt.sign({
                userId: user._id,
                username: req.body.username,
                csrfToken: csrfToken
            },
                process.env.JWT_KEY
            );

            await LastSeen.create({
                user_id: user._id,
                last_seen: {}
            });

            res.cookie('jwt', jwtToken, {
                httpOnly: true,
                sameSite: true,
                expires: new Date(253402300000000)
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
async function userLogIn(req: Request, res: Response) {
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
                sameSite: true,
                expires: new Date(253402300000000)
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
async function reAuthUser(req: Request, res: Response) {
    try {
        const jwtToken = req.cookies.jwt;
        const decoded = jwt.verify(jwtToken, process.env.JWT_KEY) as IJwtDecoded;
        const csrfToken = req.headers['csrf-token'] as string;
        
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

async function getLastSeen(
    req: Request & {decodedJwt: IJwtDecoded}, 
    res: Response
) {
    try {
        const userLastSeen = await LastSeen
            .findOne({user_id: req.decodedJwt.userId})
            .select('-__v')
            .exec();
        
        res.status(200).json(userLastSeen);
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        })
    }
}

module.exports = {
    userSignUp,
    userLogIn,
    reAuthUser,
    getLastSeen
}