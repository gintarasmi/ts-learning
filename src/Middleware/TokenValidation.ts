import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../Utils/Config';

const validate = () => (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jsonwebtoken.verify(token, config.secret.access, (err, user) => {
      if (err) {
        return res.status(403).json();
      }
      next();
    });
  } else {
    return res.status(401).json();
  }
};

export default validate;
