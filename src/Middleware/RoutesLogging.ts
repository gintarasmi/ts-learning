import { Request, Response, NextFunction } from 'express';
import Logging from '../Utils/Logging';

const logging = (req: Request, res: Response, next: NextFunction) => {
  Logging.info(
    `Incoming. Method:[${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    Logging.info(
      `Outgoing. Method:[${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
    );
  });

  next();
};

export default logging;
