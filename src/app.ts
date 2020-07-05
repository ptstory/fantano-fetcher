import { YoutubeService } from './services/youtube.service';
import { isPresent } from './filters/is-present.filter';
import { ReviewConverter } from './converters/review.converter';
import { MongoDBService } from './services/mongodb.service';

export class App {
    // Switch over to DI
    private youtubeService = new YoutubeService();
    private mongoDBService = new MongoDBService();

    async run(): Promise<void> {

        const allVideos = await Promise.resolve(this.youtubeService.getAllVideos());
        const albumReviews = allVideos.filter(v => v?.snippet?.title?.endsWith('ALBUM REVIEW'))
            .map(v => v.snippet)
            .filter(isPresent);

        const snippets = albumReviews.filter(r => !!r)
            .map(ReviewConverter.convertToReview)
            .sort((a, b) => (a.date < b.date) ? 1 : -1);

        this.mongoDBService.populateDB(snippets);
    }
}

