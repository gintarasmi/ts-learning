import express from 'express';
import mongoose from 'mongoose';
import { config } from './Utils/Config';
import Logging from './Utils/Logging';
import { application } from './CreateApp';

const app = express();

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('hello');
    Logging.info('Connected to MongoDB');
    //starts if connected
    application.listen();
  })
  .catch((error) => {
    Logging.error(error);
  });
