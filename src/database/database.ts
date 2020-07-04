import Mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { ReviewModel } from './reviews/reviews.model';

let database: Mongoose.Connection;

export const connect = () => {
  const uri = process.env.MONGODB_URI;

  if (database) {
    return;
  }

  Mongoose.connect(uri!, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = Mongoose.connection;

  database.once('open', async () => {
    logger.info('Connected to database');
  });

  database.on('error', () => {
    logger.error('Error connecting to database');
  });

  return {
    ReviewModel,
  };
};

export const disconnect = () => {
  if (!database) {
    return;
  }

  Mongoose.disconnect();
};
