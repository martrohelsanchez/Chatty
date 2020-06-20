const router = require('express')();

const User = require("../model/user");

router.post('/', (req, res, next) => {
    User.find({username: req.body.username})
        .select('username')
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user: user,
                    authFailed: false
                })
            } else {
                res.status(401).json({
                    authFailed: true
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