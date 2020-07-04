import { google, youtube_v3 } from 'googleapis';
import * as dotenv from 'dotenv';
import { ActivityListResponse } from '../interfaces/play-list-response.interface';

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

  async getAllVideos(publishedAfter: string = new Date('09-24-2009').toISOString(),
    nextPageToken: string = '', items: youtube_v3.Schema$PlaylistItem[] = [])
    : Promise<youtube_v3.Schema$PlaylistItem[]> {
    let res = await this.getVideos(nextPageToken, publishedAfter);
    if (!res?.items) return [];
    let newItems = items.concat(res.items);
    while (res.items.length === this.pageSize) {
      res = await this.getVideos(res.nextPageToken, publishedAfter);
      newItems = newItems.concat(res.items);
    }
    return newItems;
  }

  async getVideos(pageToken: string, publishedAfter: string): Promise<ActivityListResponse> {
    const params: youtube_v3.Params$Resource$Activities$List = {
      channelId: 'UCt7fwAhXDy3oNFTAzF2o8Pw',
      part: ['snippet'],
      publishedAfter,
      maxResults: this.pageSize,
      pageToken
    };
    const res = await this.youtubeApi.activities.list(params);
    if (!res.data.pageInfo) return {} as ActivityListResponse;
    return {
      totalResults: res.data.pageInfo.totalResults as number,
      items: res.data.items?.filter(i => i.snippet?.type === 'upload') as youtube_v3.Schema$PlaylistItem[],
      nextPageToken: res.data.nextPageToken as string
    };
  }

}
