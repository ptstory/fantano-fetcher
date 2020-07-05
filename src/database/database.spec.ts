import mongoose, { Mongoose, ConnectionOptions } from 'mongoose';
import { logger } from '../utils/logger';

jest.mock('mongoose');

describe('connect', () => {
  const dbModule = require('./database');
  const uri = process.env.MONGODB_URI;

  it('should connect database succesfully', done => {
    const loggerSpyOn = jest.spyOn(logger, 'info');
    const mongooseConnectSpyOn = jest
      .spyOn<Mongoose, 'connect'>(mongoose, 'connect')
      .mockImplementationOnce((uris: string, options?: ConnectionOptions, callback?: (err?: Error) => void) => {
        if (callback) {
          callback();
          done();
        }
        return Promise.resolve(mongoose);
      });

    dbModule.connect();
    expect(mongooseConnectSpyOn).toBeCalledWith(
        uri,
        {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        },
      dbModule.callback
    );
    expect(loggerSpyOn).toBeCalledWith('Connected to database');
    loggerSpyOn.mockRestore();
  });

  it('connection error', done => {
    const loggerSpyOn = jest.spyOn(logger, 'error');
    const mongooseConnectSpyOn = jest
      .spyOn<Mongoose, 'connect'>(mongoose, 'connect')
      .mockImplementationOnce((uris: string, options?: ConnectionOptions, callback?: (err?: Error) => void) => {
        if (callback) {
            callback(new Error('Error connecting to database'));
          done();
        }
        return Promise.resolve(mongoose);
      });

    dbModule.connect();
    expect(mongooseConnectSpyOn).toBeCalledWith(
      uri,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      dbModule.callback
    );
    expect(loggerSpyOn).toBeCalledWith('Error connecting to database');
    loggerSpyOn.mockRestore();
  });
});
