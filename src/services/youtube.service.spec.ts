import { YoutubeService } from './youtube.service';
import { youtube_v3 } from 'googleapis';

describe('YoutubeService', () => {
  let service: YoutubeService;
  let playlistRequestSpy: jasmine.Spy;

  const responseItems = [{
    snippet: {}
  } as youtube_v3.Schema$PlaylistItem];

  beforeEach(() => {
    service = new YoutubeService();

    playlistRequestSpy = spyOn((service as any).youtubeApi.playlistItems, 'list');
    playlistRequestSpy.and.returnValue({
      data: {
        nextPageToken: 'a-b-c',
        items: responseItems,
        pageInfo: {
          totalResults: 123
        }
      }
    });
  });

  describe('getVideos', () => {
    test('should return results', async () => {
      const token = 'token';
      const results = await service.getVideos(token);

      const expectedParams = {
        playlistId: 'UUt7fwAhXDy3oNFTAzF2o8Pw',
        part: ['snippet'],
        maxResults: 50,
        pageToken: token
      };

      expect((service as any).youtubeApi.playlistItems.list).toHaveBeenCalledWith(expectedParams);
      expect(results).toEqual({
        totalResults: 123,
        videos: responseItems,
        nextPageToken: 'a-b-c'
      });
    });

    test('should return empty for empty pageInfo', async () => {
      playlistRequestSpy.and.returnValue({
        data: {
          nextPageToken: 'a-b-c',
          items: responseItems,
          pageInfo: null
        }
      });
      const token = 'token';
      const results = await service.getVideos(token);

      const expectedParams = {
        playlistId: 'UUt7fwAhXDy3oNFTAzF2o8Pw',
        part: ['snippet'],
        maxResults: 50,
        pageToken: token
      };

      expect((service as any).youtubeApi.playlistItems.list).toHaveBeenCalledWith(expectedParams);
      expect(results).toEqual({});
    });
  });

  describe('getAllVideos', () => {
    test('should return results', async () => {
      const results = await service.getAllVideos();

      expect((service as any).youtubeApi.playlistItems.list).toHaveBeenCalled();
      expect(results).toEqual(responseItems);
    });

    test('should return empty array if api request is empty', async () => {
      playlistRequestSpy.and.returnValue({
        data: {
          nextPageToken: 'a-b-c',
          items: null,
          pageInfo: {
            totalResults: 123
          }
        }
      });
      const results = await service.getAllVideos();

      expect((service as any).youtubeApi.playlistItems.list).toHaveBeenCalled();
      expect(results).toEqual([]);
    });

    test('should return multiple pages of results', async () => {
      playlistRequestSpy.and.returnValues({
        data: {
          nextPageToken: 'a-b-c',
          items: [
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
          ],
          pageInfo: {
            totalResults: 123
          }
        }
      },
      {
        data: {
          nextPageToken: '1-2-3',
          items: responseItems,
          pageInfo: {
            totalResults: 123
          }
        }
      });
      const results = await service.getAllVideos();

      expect((service as any).youtubeApi.playlistItems.list).toHaveBeenCalled();
      expect(results).toEqual([
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        ...responseItems
      ]);
    });
  });

});
