import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import CsrfTokenGen from 'csrf';

import {IJwtDecoded} from "shared/types";

const csrfTokenGen = new CsrfTokenGen({saltLength: 8, secretLength: 18});

module.exports = (
  req: Request & {decodedJwt: IJwtDecoded},
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtToken = req.cookies.jwt;
    const decoded = jwt.verify(jwtToken, process.env.JWT_KEY) as IJwtDecoded;
    const csrfToken = req.headers["csrf-token"] as string;

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
      isAuth: false,
    });
  }
};