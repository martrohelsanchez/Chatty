import {Request, Response} from 'express';
import mongoose from 'mongoose'
import {getIo} from '../websocket';

import User from '../model/user';
import Conversation from '../model/conversation';
import Message from '../model/message';
import MembersMeta from '../model/membersMeta';
import {IJwtDecoded} from '../shared/types';
import {IUserSchema} from '../model/user';
import { msgsDeliveredUpdated } from '../cache';
import LastSeen from '../model/lastSeen';

//search users /search
async function searchUsers (
    req: Request<{}, {}, {}, {searchInput: string}> & {decodedJwt: IJwtDecoded},
     res: Response
) {
    try {
        const searchInput = req.query.searchInput;
        const searchRegex = new RegExp(escapeRegex(searchInput), "gi");
        const userId =  req.decodedJwt.userId;
        const users = await User.find({$and: [{_id: {$ne: userId}}, {username: searchRegex}]})
            .select("-password -__v")
            .exec()

        function escapeRegex(text: string) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        res.status(200).json({
            users
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            err: err.message
        });
    }
};

//GET /chat/conversation
//Get one conversation where the members are exactly on query.members
async function getOneConversation(
    req: Request<{}, {}, {}, {members: string[]}>,
    res: Response
) {
    try {
        const query = req.query;
        const conversation = await Conversation.findOne({
            members: {$all: [...query.members]}
        })
            .select('-__v')
            .populate({
                path: 'last_message',
                select: '-__v'
            })
            .exec();

        res.status(200).json({
            conversation: conversation
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            err: err.message
        });
    }
}

// GET /chat/conversations
async function getConversations (
    req: Request<{}, {}, {}, {
        before: string,
        limit: string
    }> & {decodedJwt: IJwtDecoded}, 
    res: Response
) {
    try {
        const query = req.query;
        const before = Number(query.before) || Date.now();
        const limit = Number(query.limit);

        const conversations =
            await Conversation.find({
                members: req.decodedJwt.userId,
                last_updated: {
                    $lt: before
                }
            })
                .sort({
                    last_updated: -1
                })
                .limit(limit)
                .select('-__v')
                .populate({
                    path: 'last_message',
                    select: '-__v'
                })
                .exec();

        res.status(200).json({
            conversations
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            err: err.message
        })
    }
}

//GET /conversations/:conversationId
async function getTheConversation(
    req: Request<{conversationId: string}>, 
    res: Response
) {
    try {
        const {conversationId} = req.params;

        const conversation = 
            await Conversation.findOne({_id: conversationId})
            .select('-__v')
            .populate({
                path: 'last_message',
                select: '-__v'
            })
            .exec();

        res.status(200).json({
            conversation: conversation
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            err: err.message
        })
    }
}

// patch /conversations/:conversationId/seen
async function updateSeen (
    req: Request & {decodedJwt: IJwtDecoded}, 
    res: Response
) {
    try {
        const io = getIo();
        const userId = req.decodedJwt.userId;
        const convId = req.params.conversationId;
        const setDate = Date.now();
        const conv = await MembersMeta
            .findOneAndUpdate({
                conversation_id: convId,
                members_meta: {
                    $elemMatch: {
                        user_id: userId
                    }
                }
            }, {
                $set: {
                    "members_meta.$.last_seen": setDate
                }
            }, {
                new: true
            })

        const fieldToUpdate = `last_seen.${convId}`;
        await LastSeen
            .findOneAndUpdate({
                user_id: userId
            }, {
                $set: {
                    [fieldToUpdate]: setDate
                }
            }); 

        res.status(200).json({
            convId: convId,
            userId: userId,
            new_seen: setDate
        });

        io.in(conv?._id).emit('seen', convId, userId, setDate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            err: err.message
        })
    }
}

// patch /conversations/:conversationId/deliver
async function updateIsDelivered(
    req: Request<{
        conversationId: string
    }, {}, {
        msgId: string
    }>, 
    res: Response
) {
    try {
        const io = getIo();
        const convId = req.params.conversationId;
        const msgId = req.body.msgId;

        if (msgsDeliveredUpdated[msgId] !== undefined) {
            //A previous request has already updated the is_delivered field in the message document
            return res.status(200).end();
        }

        //Cache the message id to tell future requests that this 
        //message's is_delivered field was already updated
        msgsDeliveredUpdated[msgId] = 'delivered';

        const msg = await Message.findOneAndUpdate({
            _id: msgId
        }, {
            $set: {
                'is_delivered': true
            }
        }, {
            new: true
        });

        io.in(msg?.sender as string).emit('msgDelivered', convId, msgId);

        res.status(200).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            err: err.message
        })
    }
}

//POST /chat/conversations
async function createConversation (
    req: Request<{}, {}, {
        membersId: string[],
        groupName?: string,
        lastMessageId?: string,
        groupPic?: string
    }> & {decodedJwt: IJwtDecoded}, 
    res: Response
) {
    try {
        const { decodedJwt, body } = req;
        const members_meta = body.membersId.map(id => {
            return {
                user_id: id,
                last_seen: 0
            }
        });
        const isGroupChat = body.membersId.length > 2 ? true : false
        let convPic: {[key: string]: string} = {};
        let users: IUserSchema[] = [];

        if (isGroupChat) {
            convPic = {convPic: body.groupPic as string}
        } else {
            users = await User
                .find({_id: {
                    $in: body.membersId
                }})
                .select('-__v')
                .exec();
                
            users.forEach(user => convPic[user._id] = user.profile_pic);
        }

        const membersMetaId = mongoose.Types.ObjectId() as unknown as string;

        const conversation = await Conversation.create({
            _id: new mongoose.Types.ObjectId,
            members: body.membersId,
            is_group_chat: isGroupChat,
            group_name: body.groupName || undefined,
            created_at: Date.now(),
            last_updated: Date.now(),
            members_meta: membersMetaId,
            conversation_pic: convPic,
            last_message: body.lastMessageId || new mongoose.Types.ObjectId as unknown as string,
            members_username: users.map(user => user.username)
        });

        const membersMeta = await MembersMeta.create({
            _id: membersMetaId,
            conversation_id: conversation._id,
            members_meta: members_meta
        })

        res.status(200).json(conversation);
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        });
    }
};

//Getting the messages of a conversation
async function getMessages(
    req: Request<{
        conversationId: string
    }, {}, {}, {
        before: string,
        limit: string
    }>, 
    res: Response
) {
    try {
        const limit = Number(req.query.limit);
        const before = Number(req.query.before) || Date.now();
        const conversationId = req.params.conversationId;

        const messages = await Message
            .find({
                conversation_id: conversationId,
                date_sent: { $lt: before }
            })
            .select('-__v')
            .sort({
                date_sent: -1
            })
            .limit(limit)
            .exec();

        res.status(200).json({
            messages: messages
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        })
    }
};

// POST /chat/conversations/:conversationId/messages
async function sendMessage(
    req: Request<{
        conversationId: string
    }, {}, {
        messageBody: string,
        convMembers: string[]
    }> & {decodedJwt: IJwtDecoded},
    res: Response
) {
    try {
        const conversationId = req.params.conversationId;
        const decodedJwt = req.decodedJwt;
        const {messageBody, convMembers} = req.body;
        const io = getIo();

        const message = await Message.create({
            _id: new mongoose.Types.ObjectId,
            conversation_id: conversationId,
            sender_username: decodedJwt.username,
            sender: decodedJwt.userId,
            message_body: messageBody,
            date_sent: Date.now(),
            is_delivered: false
        });

        delete message.__v;

        for (let userId of convMembers) {
            //Emit an event to all the members of the conversation except the sender
            if (userId !== decodedJwt.userId) {
                io.in(userId).emit('sendMsg', message);
            }
        }

        res.status(200).json(message);

        const conversation = await Conversation.updateOne({_id: conversationId}, {
            $set: {
                last_message: message._id,
                last_updated: message.date_sent
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        })
    }
};

async function getMembers(
    req: Request<{
        //params
        convId: string
    }, {}, {}, {
        //ReqQuery
        usersId: string[]
    }>,
    res: Response
) {
    try {
        const members = await User
            .find({_id: {
                $in: req.query.usersId
            }})
            .select('-__v -password')
            .exec();

        res.status(200).json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        })
    }
}

async function getMembersMeta(
    req: Request<{}, {}, {}, {
        membersMetaId: string
    }>,
    res: Response
) {
    try {
        const membersMeta = await MembersMeta
            .findOne({_id: req.query.membersMetaId})
            .select('-__v')
            .exec();
        
        res.status(200).json(membersMeta);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        })
    }
}

module.exports = {
    searchUsers,
    getOneConversation,
    getConversations,
    getTheConversation,
    updateSeen,
    updateIsDelivered,
    createConversation,
    getMessages,
    sendMessage,
    getMembers,
    getMembersMeta
};