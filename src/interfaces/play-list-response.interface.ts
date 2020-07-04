import { youtube_v3 } from 'googleapis';

export interface ActivityListResponse {
    totalResults: number,
    items: youtube_v3.Schema$ActivityListResponse[],
    nextPageToken: string
}
