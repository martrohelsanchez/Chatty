const router = require('express')();
const jwt = require('jsonwebtoken');

const User = require("../model/user");

router.post('/', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })
          .select("-__v")
          .exec();

        if (user) {
            const token = jwt.sign({
                userId: user._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            });

            res.status(200).json({
              _id: user._id,
              username: user.username,
              conversations: user.conversations,
              isAuth: true,
              token
            });
        } else {
            res.status(401).json({
              isAuth: false,
            });
        }
    } catch (err) {
        res.status(200).json({
            err
        })
    }
})

module.exports = router;