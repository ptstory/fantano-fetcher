import { google, youtube_v3 } from 'googleapis';
import * as dotenv from 'dotenv';
import { PlayListResponse } from '../interfaces/play-list-response.interface';

export class YoutubeService {
  private youtubeApi: youtube_v3.Youtube;

  constructor() {
    dotenv.config();
    this.youtubeApi = google.youtube({
        version: 'v3',
        auth: process.env.API_KEY,
    });
  }

  async getAllVideos(nextPageToken: string, items: youtube_v3.Schema$PlaylistItem[], count: number)
      : Promise<youtube_v3.Schema$PlaylistItem[]> {
    const res = await this.getVideos(nextPageToken);
    if (!res) return [];
    const newItems = items.concat(res.videos);
    if (count < 1) {
      // if (count < res.totalResults / 50) {
      return this.getAllVideos(res.nextPageToken = '', newItems, count + 1);
    } else {
      return newItems;
    }
  }

  async getVideos(pageToken: string): Promise<PlayListResponse> {
    const params: youtube_v3.Params$Resource$Playlistitems$List = {
        playlistId: 'UUt7fwAhXDy3oNFTAzF2o8Pw',
        part: ['snippet'],
        maxResults: 50,
        pageToken
    };
    const res = await this.youtubeApi.playlistItems.list(params);
    if (!res.data.pageInfo) return {} as PlayListResponse;
    return {
        totalResults: res.data.pageInfo.totalResults as number,
        videos: res.data.items as youtube_v3.Schema$PlaylistItem[],
        nextPageToken: res.data.nextPageToken as string
    };
  }

}
