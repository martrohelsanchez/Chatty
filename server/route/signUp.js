const router = require('express')();

const User = require('../model/user');

router.post('/', (req, res, next) => {
    User.findOne({username: req.body.username})
        .select('username')
        .exec()
        .then(user => {
            if (!user) {
                //User doesn't exist yet
                User.create({
                    username: req.body.username
                })
                    .then(
                        res.status(200).json({
                            isUsernameTaken: false
                        })
                    )
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
})

module.exports = router;