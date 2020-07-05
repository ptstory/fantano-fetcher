import {connect, disconnect } from '../../utils/mongoMemoryMock';
import { ReviewModel } from './reviews.model';
import { Review } from '../../interfaces/review.interface';


beforeAll(async () => await connect());
afterAll(async () => await disconnect());

const review =  {
    date: '2019-10-09',
    url: 'youtube.com/watch?v=V2ZTJ8oD4TQ',
    artist: 'Danny Brown',
    album: 'uknowhatimsayin¿',
    rating: '8/10',
    genres: [ 'ALTERNATIVE HIP HOP', 'HARDCORE HIP HOP' ]
  } as Review;

describe('review', () => {
    it('can be created correctly', async () => {
        expect(async () => await ReviewModel.create(review))
            .not
            .toThrow();

        const savedReview = await ReviewModel.create(review);
        expect(savedReview._id).toBeDefined();
        expect(savedReview.dateOfEntry).toBeDefined();
        expect(savedReview.artist).toBe(review.artist);
    });
});
