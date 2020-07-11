import { connect, disconnect } from '../database/database';
import { ReviewModel } from '../database/reviews/reviews.model';
import { Review } from '../interfaces/review.interface';
import { logger } from '../utils/logger';
import { SpotifyService } from './spotify.service';

export class MongoDBService {
    // const lastAddedReview = await ReviewModel.findOne({}).sort({ _id: 1 });
    // const lastDateAdded = lastAddedReview?.dateOfEntry?.getTime();

    async connectDB() {
        return connect();
    }

    async populateDB(snippets: Review[]): Promise<void> {
        const spotify = await SpotifyService.create();
        try {
            for (let snippet of snippets) {
                const cover = await Promise.resolve(spotify
                        .getAlbumCover(snippet.artist, snippet.album));
                snippet = {...snippet, albumCover: cover};
                await ReviewModel.create(snippet);
                logger.info(`Created review ${snippet.artist} ${snippet.album} ${snippet.albumCover}`);
                // if (new Date(snippet.date).getTime() > lastDateAdded!) {
                //     await ReviewModel.create(snippet);
                //     logger.info(`Created review ${snippet.artist} ${snippet.album}`);
                // }
            }
        } catch (err) {
            logger.error(err);
        } finally {
            disconnect();
        }
    }
}
