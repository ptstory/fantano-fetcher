import SpotifyWebApi from 'spotify-web-api-node';
import * as dotenv from 'dotenv';

export class SpotifyService {
    private spotify: SpotifyWebApi;

    constructor() {
        dotenv.config();

        this.spotify = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        });
    }

    async init() {
        await this.spotify.clientCredentialsGrant()
            .then(
                (data) => {
                    this.spotify.setAccessToken(data.body.access_token);
                }
            );
    }

    static async create() {
        const spotify = new SpotifyService();
        await spotify.init();
        return spotify;
    }

    async getAlbumCover(artist: string, album: string): Promise<any> {
        const res = await this.spotify.searchAlbums(`album:${album} artist:${artist}`);
        // if (!res.body.albums) {
        //     return ""
        // }
        return res.body.albums?.items[0]?.images[0]?.url;
    }
}
