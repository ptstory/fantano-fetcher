import { youtube_v3 } from 'googleapis';
import { ReviewConverter } from './review.converter';
import { Review } from '../interfaces/review.interface';


describe('ReviewConverter', () => {

  test('should parse valid snippet', () => {
    const snippet = {
      title: 'ARTIST - ALBUM ALBUM REVIEW',
      description: 'PHOEBE BRIDGERS - PUNISHER / 2020 / DEAD OCEANS / SINGER-SONGWRITER, INDIE FOLK \n\n 8/10',
      publishedAt: '2020-10-12T23:59:59.000',
      resourceId: {
        videoId: 'the-id'
      }
    } as youtube_v3.Schema$PlaylistItemSnippet;

    expect(ReviewConverter.convertToReview(snippet)).toEqual({
      album: 'ALBUM',
      artist: 'ARTIST',
      date: '2020-10-12',
      genres: ['SINGER-SONGWRITER', 'INDIE FOLK'],
      rating: '8/10',
      url: 'youtube.com/watch?v=the-id'
    } as Review);
  });

  test('should parse valid snippet with empty title', () => {
    const snippet = {
      title: '',
      description: 'PHOEBE BRIDGERS - PUNISHER / 2020 / DEAD OCEANS / SINGER-SONGWRITER, INDIE FOLK \n\n 8/10',
      publishedAt: '2020-10-12T23:59:59.000',
      resourceId: {
        videoId: 'the-id'
      }
    } as youtube_v3.Schema$PlaylistItemSnippet;

    expect(ReviewConverter.convertToReview(snippet)).toEqual({
      album: '',
      artist: '',
      date: '2020-10-12',
      genres: ['SINGER-SONGWRITER', 'INDIE FOLK'],
      rating: '8/10',
      url: 'youtube.com/watch?v=the-id'
    } as Review);
  });

  test('should parse empty snippet', () => {
    expect(ReviewConverter.convertToReview({})).toEqual({
      album: '',
      artist: '',
      date: '',
      genres: [],
      rating: '',
      url: ''
    } as Review);
  });

  test('should parse snippet from specified date range', () => {
    const snippet = {
      title: 'ARTIST - ALBUM ALBUM REVIEW',
      description: '7/10 \n\n THE STRANGE BOYS- LIVE MUSIC / 2011/ ROUGH TRADE / BLUES ROCK, ALT COUNTRY, INDIE ROCK',
      publishedAt: '2011-11-03T23:59:59.000',
      resourceId: {
        videoId: 'the-id'
      }
    } as youtube_v3.Schema$PlaylistItemSnippet;

    expect(ReviewConverter.convertToReview(snippet)).toEqual({
      album: 'ALBUM',
      artist: 'ARTIST',
      date: '2011-11-03',
      genres: ['BLUES ROCK', 'ALT COUNTRY', 'INDIE ROCK'],
      rating: '7/10',
      url: 'youtube.com/watch?v=the-id'
    } as Review);
  });

  test('should parse snippet prior to specified date range', () => {
    const snippet = {
      title: 'ARTIST - ALBUM ALBUM REVIEW',
      description: '7/10 \n\n THE STRANGE BOYS- LIVE MUSIC / 2011/ ROUGH TRADE / BLUES ROCK, ALT COUNTRY, INDIE ROCK',
      publishedAt: '2011-06-27T23:59:59.000',
      resourceId: {
        videoId: 'the-id'
      }
    } as youtube_v3.Schema$PlaylistItemSnippet;

    expect(ReviewConverter.convertToReview(snippet)).toEqual({
      album: 'ALBUM',
      artist: 'ARTIST',
      date: '2011-06-27',
      genres: [],
      rating: '7/10',
      url: 'youtube.com/watch?v=the-id'
    } as Review);
  });

  ['CLASSIC', 'NOT GOOD'].forEach((memeScore) => {
    test(`should parse snippet with score of ${memeScore}`, () => {
      const snippet = {
        title: 'ARTIST - ALBUM ALBUM REVIEW',
        description: `\nPHOEBE BRIDGERS - PUNISHER / 2020 / DEAD OCEANS / SINGER-SONGWRITER, INDIE FOLK \n\n ${memeScore}/10`,
        publishedAt: '2020-10-12T23:59:59.000',
        resourceId: {
          videoId: 'the-id'
        }
      } as youtube_v3.Schema$PlaylistItemSnippet;

      expect(ReviewConverter.convertToReview(snippet)).toEqual({
        album: 'ALBUM',
        artist: 'ARTIST',
        date: '2020-10-12',
        genres: ['SINGER-SONGWRITER', 'INDIE FOLK'],
        rating: `${memeScore}/10`,
        url: 'youtube.com/watch?v=the-id'
      } as Review);
    });
  });

});
