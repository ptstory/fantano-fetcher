import mongoose, { Mongoose, ConnectionOptions } from 'mongoose';
import { logger } from '../utils/logger';

jest.mock('mongoose');

describe('Database functions', () => {
  const dbModule = require('./database');
  const uri = process.env.MONGODB_URI;
  let logInfoSpy: jasmine.Spy;
  let logErrorSpy: jasmine.Spy;

  beforeEach(() => {
    logInfoSpy = spyOn(logger, 'info');
    logErrorSpy = spyOn(logger, 'error');
  });

  describe('connect', () => {
    let mongooseConnectSpyOn: jasmine.Spy;

    beforeEach(() => {
      mongooseConnectSpyOn = spyOn(mongoose, 'connect');
    });

    it('should connect database succesfully', () => {
      mongooseConnectSpyOn.and
        .callFake((uris: string, options?: ConnectionOptions, callback?: (err?: Error) => void) => {
          if (callback) {
            callback();
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
      expect(logInfoSpy).toBeCalledWith('Connected to database');
      expect(logErrorSpy).not.toHaveBeenCalled();
    });

    it('connection error', () => {
      mongooseConnectSpyOn.and
        .callFake((uris: string, options?: ConnectionOptions, callback?: (err?: Error) => void) => {
          if (callback) {
            callback(new Error('Error connecting to database'));
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
      expect(logInfoSpy).not.toHaveBeenCalled();
      expect(logErrorSpy).toBeCalledWith('Error connecting to database');
    });
  });

  describe('disconnect', () => {
    const mongooseDisconnectSpyOn = jest
      .spyOn<Mongoose, 'disconnect'>(mongoose, 'disconnect');

    it('should disconnect', () => {
      dbModule.disconnect();
      expect(mongooseDisconnectSpyOn).toHaveBeenCalled();
    });
  });
});
