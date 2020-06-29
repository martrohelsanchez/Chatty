const router = require('express')();

const User = require('../model/user');

router.post('/', (req, res, next) => {
    console.log(req.body)
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
    };

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
})



module.exports = router;