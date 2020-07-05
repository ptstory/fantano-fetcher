import { connect, disconnect } from '../database/database';
import { ReviewModel } from '../database/reviews/reviews.model';
import { Review } from '../interfaces/review.interface';
import { logger } from '../utils/logger';

export class MongoDBService {
    // const lastAddedReview = await ReviewModel.findOne({}).sort({ _id: 1 });
     // const lastDateAdded = lastAddedReview?.dateOfEntry?.getTime();

async populateDB(snippets: Review[]): Promise<void> {
    connect();
    try {
        for (const snippet of snippets) {
            await ReviewModel.create(snippet);
            logger.info(`Created review ${snippet.artist} ${snippet.album}`);
            // if (new Date(snippet.date).getTime() > lastDateAdded!) {
            //     await ReviewModel.create(snippet);
            //     logger.info(`Created review ${snippet.artist} ${snippet.album}`);
            // }
        }
        disconnect();
    } catch (err) {
        logger.error(err);
    }
}
}
