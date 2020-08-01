const mongoose = require('mongoose');
const io = require('../websocket').getIo();

const User = require('../model/user');
const Conversation = require('../model/conversation');
const Message = require('../model/message');

//search users /search
function searchUsers (req, res) {
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    const searchRegex = new RegExp(escapeRegex(req.body.searchInput), "gi");

    User.find({ username: searchRegex })
        .select("username")
        .exec()
        .then((users) => {
            res.status(200).json({
                users,
            });
        })
        .catch((err) => {
            res.status(500).json({
                err,
            });
        });
};

//getting conversations 
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
                .exec();

        res.status(200).json({
            conversations
        })
    } catch (err) {
        res.status(500).json({
            err: err.message
        })
    }
}

//getting a conversation
async function getOneConversation(req, res) {
    try {
        const {conversationId} = req.params;

        const conversation = 
            await Conversation.findOne({_id: conversationId})
            .select('-__v')
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

//creating a new conversation
async function createConversation (req, res) {
    try {
        const { decodedJwt, body } = req;

        const conversation = await Conversation.create({
            _id: new mongoose.Types.ObjectId,
            members: body.membersId,
            conversation_name: body.conversationName,
            created_at: Date.now(),
            last_updated: Date.now()
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
                .populate('sender', '-__v')
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
            seen: [],
            is_sent: true,
            is_delivered: false,
            date_sent: Date.now()
        });
        delete message._doc.__v;

        for (let userId of convMembers) {
            if (userId !== decodedJwt.userId) {
                message._doc.sender_username = decodedJwt.userId;

                io.in(userId).emit('sendMsg', message._doc);
                io.in('lodi').emit('tangap', message._doc);
            }
        }

        res.status(200).json({
            ...message._doc
        });

        const conversation = await Conversation.updateOne({_id: conversationId}, {
            $set: {
                last_message: {
                    message_body: messageBody,
                    sender_username: decodedJwt.username
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
    getConversations,
    getOneConversation,
    createConversation,
    getMessages,
    sendMessage
};