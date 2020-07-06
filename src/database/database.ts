import Mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { ReviewModel } from './reviews/reviews.model';

export const callback = (err?: Error) => {
  if (err) {
    logger.error(err.message);
  } else {
    logger.info('Connected to database');
  }
};

export const connect = () => {
  const uri = process.env.MONGODB_URI;

  Mongoose.connect(uri!, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }, callback);

  return {
    ReviewModel,
  };
};

export const disconnect = () => {
  Mongoose.disconnect();
};
