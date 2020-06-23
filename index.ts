import { google, youtube_v3 } from 'googleapis';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

interface PlayListResponse {
    totalResults: number,
    videos: youtube_v3.Schema$PlaylistItem[],
    nextPageToken: string
}

interface Review {
    date: string,
    url: string,
    artist: string,
    album: string,
    rating: string,
    genres: string[]
}

dotenv.config();
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY,
});

//Start and End Dates for specific genre format
const fromDate = new Date('2011-06-28');
const toDate = new Date('2012-01-06');

(async () => {
    const allVideos = await Promise.resolve(getAllVideos('', [], 0));
    const albumReviews = allVideos.filter(v => v?.snippet?.title?.endsWith('ALBUM REVIEW'))
        .map(v => v.snippet)
        .filter(isPresent);

    const snippets = albumReviews.filter(r => !!r).map(review => (
        {
            date: review.publishedAt?.substring(0, 10),
            url: `youtube.com/watch?v=${review.resourceId?.videoId}`,
            artist: getArtist(review),
            album: getAlbum(review),
            rating: getRating(review.description || ''),
            genres: getGenres(review)
        } as Review
    ));

    fs.writeFile('reviews.json', JSON.stringify(snippets), (err) => {
        if (err) {
            // tslint:disable-next-line
            console.log(err)
        }
    });

})();

async function getVideos(pageToken: string) : Promise<PlayListResponse> {
    const params: youtube_v3.Params$Resource$Playlistitems$List = {
        playlistId: 'UUt7fwAhXDy3oNFTAzF2o8Pw',
        part: ['snippet'],
        maxResults: 50,
        pageToken
    };
    const res = await youtube.playlistItems.list(params);
    if (!res.data.pageInfo) return {} as PlayListResponse;
    return {
        totalResults: res.data.pageInfo.totalResults as number,
        videos: res.data.items as youtube_v3.Schema$PlaylistItem[],
        nextPageToken: res.data.nextPageToken as string
    };
}

async function getAllVideos(nextPageToken: string, items: youtube_v3.Schema$PlaylistItem[], count: number)
        : Promise<youtube_v3.Schema$PlaylistItem[]> {
    const res = await getVideos(nextPageToken);
    if (!res) return [];
    const newItems = items.concat(res.videos);
    if (count < 1) {
        // if (count < res.totalResults / 50) {
        return getAllVideos(res.nextPageToken = '', newItems, count + 1);
    } else {
        return newItems;
    }
}

function getRating(review: string): string {
    if (review.includes('CLASSIC')) return 'CLASSIC/10';
    if (review.includes('NOT GOOD')) return 'NOT GOOD/10';

    const regex = /[0-9][10]*\/[1][0]/g;
    const rating = review.match(regex) || '??/??';
    return rating[0];
}

function getArtist(review: youtube_v3.Schema$PlaylistItemSnippet): string {
    return getRegexGroupFromTitle(review, /.*(?=-)/g);
}

function getAlbum(review: youtube_v3.Schema$PlaylistItemSnippet): string {
    return getRegexGroupFromTitle(review, /(?<=-).*/g).replace(/\s+ALBUM REVIEW\s*/, '');
}

function shouldIgnoreReview(review: youtube_v3.Schema$PlaylistItemSnippet) : boolean {
    if (!review || !review?.resourceId?.videoId) return true;
    return ['F-Fd5YG2pWs', 'MNnibsPJSDY', 'LDMNhCOs0G0'].includes(review.resourceId.videoId);
}

function isPresent<T>(t: T | undefined | null | void): t is T {
    return !!t;
}

function getRegexGroupFromTitle(review: youtube_v3.Schema$PlaylistItemSnippet, regex: RegExp): string {
    if (shouldIgnoreReview(review)) return '';

    const captureGroup = (review?.title || '').trim().match(regex);
    return captureGroup ? captureGroup[0].replace(/\s*$/, '') : '';
}

function getGenres(review: youtube_v3.Schema$PlaylistItemSnippet) : string[] {
    if (!review?.description || !review?.publishedAt) {
        return [];
    }

    const formattedDesc = review.description.replace(/(?:https?):\/\/[\n\S]+/g, '')
        .replace('(THIS VIDEO IS A REUPLOAD. THE ORIGINAL HAD AN EDITING MISTAKE I WANTED TO FIX)', '');
    const reviewDate = new Date(review.publishedAt.substring(0, 10));

    const lastIndexOfForwardSlash = formattedDesc.lastIndexOf('/');
    if (reviewDate <= toDate) {
        if (reviewDate >= fromDate) {
            return formattedDesc.substring(lastIndexOfForwardSlash, formattedDesc.length)
                .split(',')
                .map(genre => genre.replace(/^\s+/g, ''));
        }
        return [];
    }

    return formattedDesc
        .substring(formattedDesc.lastIndexOf('/', lastIndexOfForwardSlash - 1) + 1, lastIndexOfForwardSlash - 1)
        .split(',')
        .map(genre => genre.trim());
}
