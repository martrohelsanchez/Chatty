import jwt from 'jsonwebtoken';
import CsrfTokenGen from 'csrf';
import {Request, Response} from 'express';

import User from '../model/user';
import LastSeen from '../model/lastSeen';
import {IJwtDecoded} from '../shared/types';
import Conversation from '../model/conversation';

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
                password: req.body.password
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
                sameSite: 'none',
                secure: true,
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
                sameSite: 'none',
                secure: true,
                expires: new Date(253402300000000)
            });
            res.status(200).json({
                userId: user._id,
                username: user.username,
                profile_pic: user.profile_pic,
                bio: user.bio,
                header: user.header,
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

//Generate new csrf and jwt token to authenticate user
// POST /user/reAuth
async function reAuthUser(req: Request, res: Response) {
    try {
        const jwtToken = req.cookies.jwt;
        const decoded = jwt.verify(jwtToken, process.env.JWT_KEY) as IJwtDecoded;
        const csrfToken = req.headers['csrf-token'] as string;

        //Fetch the updated info of user
        const user = await User
            .findOne({_id: decoded.userId})
            .exec();        

        if (!user) {
            return res.status(403).json({
                isAuth: false
            })
        }

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
            sameSite: 'none',
            secure: true
        });
        res.status(200).json({
            userId: decoded.userId,
            username: decoded.username,
            profile_pic: user.profile_pic,
            bio: user.bio,
            header: user.header,
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

//GET /user/last-seen
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

// GET /user/
async function getUserByUsername(
    req: Request<{}, {}, {}, {
        username: string
    }>,
    res: Response
) {
    try {
        const user = await User.findOne({username: req.query.username});
        res.status(200).json(user);
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        })
    }
}

async function updateBio(
    req: Request<{
        //params
        userId: string
    }, {}, {
        newBio: string
    }>,
    res: Response
) {
    try {
        await User.findOneAndUpdate({
                _id: req.params.userId
            }, {
                $set: {
                    bio: req.body.newBio
                }
            })
            .exec();
        
        res.status(200).end();
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        })
    }
}

async function updateHeader(
    req: Request<{
        //Params
        userId: string
    }, {}, {
        //ReqBody
        newHeader: string
    }>,
    res: Response
) {
    try {
        await User
            .findOneAndUpdate({
                _id: req.params.userId
            }, {
                $set: {
                    header: req.body.newHeader
                }
            }, {
                new: true
            })
            .exec();
        
        res.status(200).end();
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        })
    }
}

async function updateProfilePic(
    req: Request<{
        //Params
        userId: string
    }, {}, {
        //ReqBody
        newProfilePic: string
    }>,
    res: Response
) {
    try {
        const userId = req.params.userId;
        const userConvPicField = `conversation_pic.${userId}`;

        await User
            .findOneAndUpdate({
                _id: userId
            }, {
                $set: {
                    profile_pic: req.body.newProfilePic
                }
            })
            .exec();
        
        await Conversation
            .updateMany({
                members: userId,
                is_group_chat: false
            }, {
                $set: {
                    [userConvPicField]: req.body.newProfilePic,
                }
            })
            .exec();

        res.status(200).end();
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
    getLastSeen,
    getUserByUsername,
    updateBio,
    updateHeader,
    updateProfilePic
}