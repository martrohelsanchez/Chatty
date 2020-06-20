const router = require('express')();

const User = require('../model/user');

router.get('/', (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            res.status(200).json({
                user: user
            })
        })
});

router.get('/search', (req, res, next) => {
    User.find({})
        .select('username')
        .exec()
        .then(users => {
            res.status(200).json({
                users
            })
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        })
})



module.exports = router;