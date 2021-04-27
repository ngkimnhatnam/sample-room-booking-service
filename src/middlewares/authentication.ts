// Dependencies import
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Configs import
import securityConfig from '../configs/security';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null || token === undefined) {
    // if there isn't any token
    return res.status(401).json('Please log in first.');
  }

  jwt.verify(token, securityConfig.jwt_token_secret, (err, user: any) => {
    // if JWT expired or wrong
    if (err) return res.status(403).json('Session expired. Please log in.');

    const id = Number(req.params.user_id);
    if (id === user.user_id) {
      return next(); // pass the execution off to whatever request the client intended
    } else {
      return res.status(401).json('Action not allowed for this User Id');
    }
  });
};
