const mongoose = require('mongoose');
const io = require('../websocket').getIo();

const User = require('../model/user');
const Conversation = require('../model/conversation');
const Message = require('../model/message');

//search users /search
async function searchUsers (req, res) {
    try {
        const searchInput = req.query.searchInput;
        const searchRegex = new RegExp(escapeRegex(searchInput), "gi");
        const userId =  req.decodedJwt.userId;
        const users = await User.find({$and: [{_id: {$ne: userId}}, {username: searchRegex}]})
            .select("username")
            .exec()

        function escapeRegex(text) {
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
//Get a conversation where the members are exactly on query.members
async function getOneConversation(req, res) {
    try {
        const query = req.query;
        const conversation = await Conversation.findOne({
            members: {$all: [...query.members]}
        })
            .select('-__v')
            .populate({
                path: 'members',
                select: '-password -__v'
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
async function getConversations (req, res) {
    try {
        const query = req.query;
        const before = query.before || Date.now();
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
                    path: 'members',
                    select: '-password -__v'
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

//getting one conversation
async function getTheConversation(req, res) {
    try {
        const {conversationId} = req.params;

        const conversation = 
            await Conversation.findOne({_id: conversationId})
            .select('-__v')
            .populate({
                path: 'members',
                select: '-password -__v'
            })
            .exec();

        res.status(200).json({
            ...conversation._doc
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            err: err.message
        })
    }
}

// patch /conversations/:conversationId/seen
async function updateSeen (req, res) {
    try {
        const convMembers = req.body.convMembers || [];
        const userId = req.decodedJwt.userId;
        const convId = req.params.conversationId;
        const setDate = Date.now();

        const conv = 
            await Conversation.findOneAndUpdate({
                _id: convId,
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

        res.status(200).json({
            members_meta: [
                ...conv.members_meta
            ]
        });

        const changedLastSeen = conv.members_meta.find(user => user.user_id == userId).last_seen;

        // for (let member of convMembers) {
        //     if (member._id !== userId) {
        //         io.in(member.id).emit('seen', convId, [{user_id: userId, last_seen: changedLastSeen}]);
        //     }
        // }

        // io.in(conv._id).emit('seen', convId, [{user_id: userId, last_seen: changedLastSeen}]);
        io.in(conv._id).emit('seen', convId, userId, setDate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            err: err.message
        })
    }
}

// patch /conversations/:conversationId/deliver
async function updateIsDelivered(req, res) {
    try {
        const convId = req.params.conversationId;
        const senderId = req.body.senderId;

        const conv = await Conversation.findOneAndUpdate({
            _id: convId
        }, {
            $set: {
                "last_message.is_delivered": true
            }
        }, {
            new: true
        });

        io.in(senderId).emit('msgDelivered', convId);

        res.status(200).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            err: err.message
        })
    }
}

//creating a new conversation
async function createConversation (req, res) {
    try {
        const { decodedJwt, body } = req;
        const members_meta = body.membersId.map(id => {
            return {
                user_id: id,
                last_seen: 0
            }
        });

        const conversation = await Conversation.create({
            _id: new mongoose.Types.ObjectId,
            members: body.membersId,
            is_group_chat: body.membersId.length > 2 ? true : false,
            group_name: body.groupName || null,
            created_at: Date.now(),
            last_updated: Date.now(),
            members_meta: members_meta
        });

        res.status(200).json({
            ...conversation._doc
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err.message
        });
    }
};

//Getting the messages of a conversation
async function getMessages(req, res) {
    try {
        const limit = Number(req.query.limit);
        const before = req.query.before || Date.now();
        const conversationId = req.params.conversationId;

        const messages =
            await Message.find({
                conversation_id: conversationId,
                date_sent: { $lt: before }
            })
                .select('-__v')
                .sort({
                    date_sent: -1
                })
                .limit(limit)
                // .populate('sender', '-__v -password')
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

//Sending a message
async function sendMessage(req, res) {
    try {
        const conversationId = req.params.conversationId;
        const decodedJwt = req.decodedJwt;
        const { messageBody, convMembers } = req.body

        const message = await Message.create({
            _id: new mongoose.Types.ObjectId,
            conversation_id: conversationId,
            sender: decodedJwt.userId,
            message_body: messageBody,
            date_sent: Date.now()
        });
        delete message._doc.__v;

        for (let userId of convMembers) {
            if (userId !== decodedJwt.userId) {
                message._doc.sender = {
                    _id: decodedJwt.userId,
                    username: decodedJwt.username
                }

                io.in(userId).emit('sendMsg', message._doc);
            }
        }

        res.status(200).json({
            ...message._doc
        });

        const conversation = await Conversation.updateOne({_id: conversationId}, {
            $set: {
                last_message: {
                    message_body: messageBody,
                    sender_username: decodedJwt.username,
                    sender_id: decodedJwt.userId,
                    date_sent: message.date_sent,
                    is_delivered: false
                },
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

module.exports = {
    searchUsers,
    getOneConversation,
    getConversations,
    getTheConversation,
    updateSeen,
    updateIsDelivered,
    createConversation,
    getMessages,
    sendMessage
};