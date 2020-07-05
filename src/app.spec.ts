import { App } from './app';
import { ReviewConverter } from './converters/review.converter';
import { Review } from './interfaces/review.interface';
import { youtube_v3 } from 'googleapis';

describe('App', () => {
  let app: App;

  const playlistItem = {
    snippet: {
      title: 'ALBUM REVIEW',
      date: '2012-12-21'
    } as youtube_v3.Schema$PlaylistSnippet
  } as youtube_v3.Schema$PlaylistItem;

  const review = {
    date: '2012-12-21'
  } as Review;

  beforeEach(() => {
    app = new App();

    spyOn((app as any).youtubeService, 'getAllVideos').and.returnValue([playlistItem]);
    spyOn((app as any).mongoDBService, 'connectDB');
    spyOn((app as any).mongoDBService, 'populateDB');
    spyOn(ReviewConverter, 'convertToReview').and.returnValue(review);
  });

  test('should call for videos', (done) => {
    app.run().then(() => {
      expect((app as any).youtubeService.getAllVideos).toHaveBeenCalled();
      expect((app as any).mongoDBService.connectDB).toHaveBeenCalled();
      expect((app as any).mongoDBService.populateDB).toHaveBeenCalled();
      expect(ReviewConverter.convertToReview).toHaveBeenCalled();
      done();
    });
  });
});
