import { google, youtube_v3 } from 'googleapis';
import * as dotenv from 'dotenv';
import { PlayListResponse } from '../interfaces/play-list-response.interface';

export class YoutubeService {
  private youtubeApi: youtube_v3.Youtube;
  private readonly pageSize = 50;

  constructor() {
    dotenv.config();
    this.youtubeApi = google.youtube({
        version: 'v3',
        auth: process.env.API_KEY,
    });
  }

  async getAllVideos(nextPageToken: string = '', items: youtube_v3.Schema$PlaylistItem[] = [])
      : Promise<youtube_v3.Schema$PlaylistItem[]> {
    let res = await this.getVideos(nextPageToken);
    if (!res?.videos) return [];
    let newItems = items.concat(res.videos);
    while (res.videos.length === this.pageSize) {
      res = await this.getVideos(res.nextPageToken);
      newItems = newItems.concat(res.videos);
    }
    return newItems;
  }

  async getVideos(pageToken: string): Promise<PlayListResponse> {
    const params: youtube_v3.Params$Resource$Playlistitems$List = {
        playlistId: 'UUt7fwAhXDy3oNFTAzF2o8Pw',
        part: ['snippet'],
        maxResults: this.pageSize,
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
