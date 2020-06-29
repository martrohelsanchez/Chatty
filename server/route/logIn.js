const router = require('express')();

const User = require("../model/user");

router.post('/', (req, res, next) => {
    User.findOne({username: req.body.username})
        .select('-__v')
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    _id: user._id,
                    username: user.username,
                    conversations: user.conversations,
                    isAuth: true
                })
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
})

module.exports = router;