import { youtube_v3 } from 'googleapis';
import { Review } from '../interfaces/review.interface';
import { isPresent } from '../filters/is-present.filter';

export class ReviewConverter {
  // Start and End Dates for specific genre format
  private static readonly fromDate = new Date('2011-06-28');
  private static readonly toDate = new Date('2012-01-06');

  static convertToReview(playlistItemSnippet: youtube_v3.Schema$PlaylistItemSnippet): Review {
    return {
      date: ReviewConverter.getDate(playlistItemSnippet),
      url:  ReviewConverter.getUrl(playlistItemSnippet),
      artist: ReviewConverter.getArtist(playlistItemSnippet),
      album: ReviewConverter.getAlbum(playlistItemSnippet),
      rating: ReviewConverter.getRating(playlistItemSnippet.description || ''),
      genres: ReviewConverter.getGenres(playlistItemSnippet)
    } as Review;
  }

  private static getDate(snippet: youtube_v3.Schema$PlaylistItemSnippet): string {
    return !!snippet.publishedAt ? snippet.publishedAt.substring(0, 10) : '';
  }

  private static getUrl(snippet: youtube_v3.Schema$PlaylistItemSnippet): string {
    return !!snippet?.resourceId?.videoId ? `youtube.com/watch?v=${snippet.resourceId?.videoId}` : '';
  }

  private static getRating(review: string): string {
    if (review.includes('CLASSIC')) return 'CLASSIC/10';
    if (review.includes('NOT GOOD')) return 'NOT GOOD/10';

    const regex = /[0-9][10]*\/[1][0]/g;
    const rating = review.match(regex);
    return rating ? rating[0] : '';
  }

  private static getArtist(review: youtube_v3.Schema$PlaylistItemSnippet): string {
    return this.getRegexGroupFromTitle(review, /.*(?=-)/g);
  }

  private static getAlbum(review: youtube_v3.Schema$PlaylistItemSnippet): string {
    return this.getRegexGroupFromTitle(review, /(?<=-).*/g)
      .replace(/\s+ALBUM REVIEW\s*/, '')
      .trim();
  }

  private static shouldIgnoreReview(review: youtube_v3.Schema$PlaylistItemSnippet) : boolean {
    if (!review || !review?.resourceId?.videoId) return true;
    return ['F-Fd5YG2pWs', 'MNnibsPJSDY', 'LDMNhCOs0G0'].includes(review.resourceId.videoId);
  }


  private static getRegexGroupFromTitle(review: youtube_v3.Schema$PlaylistItemSnippet, regex: RegExp): string {
    if (this.shouldIgnoreReview(review)) return '';

    const captureGroup = (review?.title || '').trim().match(regex);
    return captureGroup ? captureGroup[0].replace(/\s*$/, '') : '';
  }

  private static getGenres(review: youtube_v3.Schema$PlaylistItemSnippet) : string[] {
    if (!review?.description || !review?.publishedAt) {
        return [];
    }

    const formattedDesc = review.description.replace(/(?:https?):\/\/[\n\S]+/g, '')
        .replace('(THIS VIDEO IS A REUPLOAD. THE ORIGINAL HAD AN EDITING MISTAKE I WANTED TO FIX)', '');
    const reviewDate = new Date(ReviewConverter.getDate(review));

    const lastIndexOfForwardSlash = formattedDesc.lastIndexOf('/');
    if (reviewDate <= this.toDate) {
        if (reviewDate >= this.fromDate) {
            return formattedDesc.substring(lastIndexOfForwardSlash + 1, formattedDesc.length)
                .split(',')
                .map(genre => genre.replace(/^\s+/g, ''));
        }
        return [];
    }

    const positionOfScore = formattedDesc.search(/\n.*\/10/);
    return formattedDesc
        .substring(formattedDesc.lastIndexOf('/', lastIndexOfForwardSlash - 1) + 1, positionOfScore)
        .split(',')
        .map(genre => genre.trim())
        .filter(isPresent);
  }
}
