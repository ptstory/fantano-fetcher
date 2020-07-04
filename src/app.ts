import { YoutubeService } from './services/youtube.service';
import { isPresent } from './filters/is-present.filter';
import { ReviewConverter } from './converters/review.converter';
import { connect, disconnect } from './database/database';
import { ReviewModel } from './database/reviews/reviews.model';
import { logger } from './utils/logger';



export class App {
    // Switch over to DI
    private youtubeService = new YoutubeService();

    async run(): Promise<void> {

        connect();

        const lastAddedReview = await ReviewModel.findOne({}).sort({ _id: 1 });
        const lastDateAdded = lastAddedReview?.dateOfEntry?.getTime();

        const allVideos = await Promise.resolve(this.youtubeService.getAllVideos());
        const albumReviews = allVideos.filter(v => v?.snippet?.title?.endsWith('ALBUM REVIEW'))
            .map(v => v.snippet)
            .filter(isPresent);

        const snippets = albumReviews.filter(r => !!r)
            .map(ReviewConverter.convertToReview)
            .sort((a, b) => (a.date < b.date) ? 1 : -1);

        try {
            for (const snippet of snippets) {
                if (new Date(snippet.date).getTime() > lastDateAdded!) {
                    await ReviewModel.create(snippet);
                    logger.info(`Created review ${snippet.artist} ${snippet.album}`);
                }
            }

            disconnect();
        } catch (err) {
            logger.error(err);
        }
    }
}

