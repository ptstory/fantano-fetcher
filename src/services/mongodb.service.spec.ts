import { MongoDBService } from './mongodb.service';
import { logger } from '../utils/logger';
import { Review } from '../interfaces/review.interface';
import { ReviewModel } from '../database/reviews/reviews.model';

describe('MongoDBService', () => {
    let service: MongoDBService;
    let reviewCreateSpy: jasmine.Spy;
    let logInfoSpy: jasmine.Spy;
    let logErrorSpy: jasmine.Spy;
    const database = require('../database/database');

    beforeEach(() => {
        service = new MongoDBService();

        reviewCreateSpy = spyOn(ReviewModel, 'create');
        logInfoSpy = spyOn(logger, 'info');
        logErrorSpy = spyOn(logger, 'error');
        spyOn(database, 'connect');
        spyOn(database, 'disconnect');
    });

    describe('connectDB', () => {
        it('should call to connect', (done) => {
            service.connectDB().then(() => {
                expect(database.connect).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('populateDB', () => {
        const review = {
            artist: 'Danny Brown',
            album: 'uknowhatimsayin¿',
        } as Review;
        const snippets = [review];

        test('should log document added', (done) => {
            service.populateDB(snippets).then(() => {
                expect(logInfoSpy).toBeCalledWith('Created review Danny Brown uknowhatimsayin¿');
                expect(database.disconnect).toHaveBeenCalled();
                done();
            });
        });

        test('should log document added', (done) => {
            reviewCreateSpy.and.throwError('oops');
            service.populateDB(snippets).then(() => {
                expect(logInfoSpy).not.toHaveBeenCalled();
                expect(logErrorSpy).toHaveBeenCalled();
                expect(database.disconnect).toHaveBeenCalled();
                done();
            });
        });
    });
});
