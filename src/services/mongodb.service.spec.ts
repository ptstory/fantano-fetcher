import { MongoDBService } from './mongodb.service';
import { logger } from '../utils/logger';
import { Review } from '../interfaces/review.interface';
import { connect, disconnect } from '../utils/mongoMemoryMock';

describe('MongoDBService', () => {
    let service: MongoDBService;
    beforeAll(async () => await connect());
    afterAll(async () => await disconnect());

    beforeEach(() => {
        service = new MongoDBService();
    });

    describe('populateDB', () => {
        test('should log document added', async () => {
            const loggerSpyOn = jest.spyOn(logger, 'info');
            const review = {
                artist: 'Danny Brown',
                album: 'uknowhatimsayin¿',
            } as Review;

            const snippets = [review];
            await service.populateDB(snippets);
            expect(loggerSpyOn).toBeCalledWith('Created review Danny Brown uknowhatimsayin¿');
        });
    });
});
