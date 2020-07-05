const router = require('express')();

const User = require('../model/user');
const Conversation = require('../model/conversation');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, (req, res, next) => {
    User.findOne({username: req.body.username})
        .select('_id username conversations')
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    _id: user._id,
                    username: user.username,
                    conversations: user.conversations,
                    isAuth: true
                });
            } else {
                res.status(401).json({
                    isAuth: false
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })
});

router.post('/search', (req, res, next) => {
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };sdfasdf

    const searchRegex = new RegExp(escapeRegex(req.body.searchInput), "gi");

    User.find({ username: searchRegex})
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
});

router.get('/:userId/conversations', async (req, res, next) => {
    try {
        const query = req.query;
        const before = query.before ? query.before : Date.now();
        const conversations = 
            await Conversation.find({
                members: req.params.userId,
                last_updated: {
                    $lt: before
                }
            })
                .sort({
                    last_updated: -1
                })
                .limit(query.limit)
                .exec();
        
        res.status(200).json({
            conversations
        })
    } catch (err) {
        res.status(500).json({
            err
        })
    }
})

router.post('/:userId/conversations', (req, res, next) => {

});

module.exports = router;