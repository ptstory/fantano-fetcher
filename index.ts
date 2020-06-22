// "use strict"

// require('dotenv').config()
import * as dotenv from "dotenv";
dotenv.config();

// const { google } = require('googleapis');
import { google, youtube_v3 } from 'googleapis';

// const fs = require("fs");
import fs from 'fs';

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY,
});

interface PlayListResponse {
    totalResults: number,
    videos: string,
    nextPageToken: string
}

async function getVideos(pageToken: string) {
    const params: youtube_v3.Params$Resource$Playlistitems$List = {
        playlistId: "UUt7fwAhXDy3oNFTAzF2o8Pw",
        part: ['snippet'],
        maxResults: 50,
        pageToken
    }
    const res = await youtube.playlistItems.list(params)
    if (!res.data.pageInfo) return
    return {
        totalResults: res.data.pageInfo.totalResults,
        videos: res.data.items,
        nextPageToken: res.data.nextPageToken
    }
}

async function getAllVideos(nextPageToken: string, items: youtube_v3.Schema$PlaylistItem[], count: number): Promise<string[]> {
    const res = await getVideos(nextPageToken)
    if (!res) return
    const newItems = items.concat(res.videos)
    console.log('newItems', newItems)
    if (count < 1) {
        // if (count < res.totalResults / 50) {
        return getAllVideos(res.nextPageToken = "", newItems, count + 1)
    } else {
        return newItems
    }
}

function getRating(review): string {
    if (review.includes("CLASSIC")) return "CLASSIC/10"
    if (review.includes("NOT GOOD")) return "NOT GOOD/10"

    const regex = /[0-9][10]*\/[1][0]/g;
    const rating = review.match(regex) || "??/??";
    return rating[0];
}

function getArtist(review): string {
    if (review.resourceId.videoId === "F-Fd5YG2pWs") return
    if (review.resourceId.videoId === "MNnibsPJSDY") return
    if (review.resourceId.videoId === "LDMNhCOs0G0") return

    const regex = /.*(?=-)/g;
    const artist = review.title.trim().match(regex);
    return artist[0].replace(/\s*$/, "");
}

function getAlbum(review): string {
    if (review.resourceId.videoId === "F-Fd5YG2pWs") return
    if (review.resourceId.videoId === "MNnibsPJSDY") return
    if (review.resourceId.videoId === "LDMNhCOs0G0") return

    const regex = /(?<=-).*/g;
    const album = review.title.trim().match(regex)
    // .replace("ALBUM REVIEW", "")
    return album[0].replace(/\s*$/, "");
}

interface Review {
    date: string,
    url: string,
    artist: string,
    album: string,
    rating: string
}

(async function () {
    const allVideos = await Promise.resolve(getAllVideos("", [], 0));
    const albumReviews = allVideos.flatMap(v => v.snippet.title.endsWith("ALBUM REVIEW") ?
        [v.snippet] : [])

    const snippets = albumReviews.map(review => ({
        date: review.publishedAt.substring(0, 10),
        url: `youtube.com/watch?v=${review.resourceId.videoId}`,
        artist: getArtist(review),
        album: getAlbum(review),
        rating: getRating(review.description)
    }))

    fs.writeFile("reviews.json", JSON.stringify(snippets), function (err) {
        if (err) {
            console.log(err)
        }
    })

})();
