import Mongoose from "mongoose";
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
    /* tslint:disable-next-line */
    console.log('Connected to database');
  });

  database.on('error', () => {
    /* tslint:disable-next-line */
    console.log('Error connecting to database');
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
