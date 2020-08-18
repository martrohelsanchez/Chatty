const jwt = require('jsonwebtoken');
const CsrfTokenGen = require('csrf');

const csrfTokenGen = new CsrfTokenGen({saltLength: 8, secretLength: 18});

module.exports = (req, res, next) => {
    try {
        const jwtToken = req.cookies.jwt;
        const decoded = jwt.verify(jwtToken, process.env.JWT_KEY);
        const csrfToken = req.headers['csrf-token'];
        
        //Verify if the csrf token was generated from the server
        if (!csrfTokenGen.verify(process.env.CSRF_TOKEN_KEY, csrfToken)) {
            throw new Error();
        }
        
        //The csrf token from req header must be the same from the token inside the jwt
        if (decoded.csrfToken !== csrfToken) {
            throw new Error();
        }

        req.decodedJwt = decoded;
        next();
    } catch (err) {
        res.status(403).json({
            isAuth: false
        })
    }
};