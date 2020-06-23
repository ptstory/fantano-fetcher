import * as fs from 'fs';
import { YoutubeService } from './services/youtube.service';
import { isPresent } from './filters/is-present.filter';
import { ReviewConverter } from './converters/review.converter';

export class App {
    // Switch over to DI
    private youtubeService = new YoutubeService();

    async run(): Promise<void> {
        const allVideos = await Promise.resolve(this.youtubeService.getAllVideos('', [], 0));
        const albumReviews = allVideos.filter(v => v?.snippet?.title?.endsWith('ALBUM REVIEW'))
            .map(v => v.snippet)
            .filter(isPresent);

        const snippets = albumReviews.filter(r => !!r)
            .map(ReviewConverter.convertToReview)
            .sort((a, b) => (a.date < b.date) ? 1 : -1);

        fs.writeFile('reviews.json', JSON.stringify(snippets), (err) => {
            if (err) {
                // tslint:disable-next-line
                console.log(err)
            }
        });
    }
}

