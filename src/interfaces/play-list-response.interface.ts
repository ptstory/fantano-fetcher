import { youtube_v3 } from 'googleapis';

export interface PlayListResponse {
    totalResults: number,
    videos: youtube_v3.Schema$PlaylistItem[],
    nextPageToken: string
}
