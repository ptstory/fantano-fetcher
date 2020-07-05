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
    spyOn(ReviewConverter, 'convertToReview').and.returnValue(review);
  });

  test('should call for videos', async () => {
    await app.run();

    expect((app as any).youtubeService.getAllVideos).toHaveBeenCalled();
    expect(ReviewConverter.convertToReview).toHaveBeenCalled();
  });

  it('tests error with async/await', async () => {
    // expect.assertions(1);
    try {
      await app.run();
    } catch (e) {
      expect(e).toEqual({
        error: 'User with 1 not found.',
      });
    }
  });
});
