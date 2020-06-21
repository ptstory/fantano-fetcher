"use strict"

require('dotenv').config()
const { google } = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY,
});

async function getVideos(pageToken) {
    const params = {
        playlistId: "UUt7fwAhXDy3oNFTAzF2o8Pw",
        part: 'snippet',
        maxResults: 50,
        pageToken
    }
    const res = await youtube.playlistItems.list(params)
    return {
        totalResults: res.data.pageInfo.totalResults,
        videos: res.data.items,
        nextPageToken: res.data.nextPageToken
    }
}

async function getAllVideos(nextPageToken, items, count) {
    const res = await getVideos(nextPageToken)
    const newItems = items.concat(res.videos)
    if (count < res.totalResults / 50) {
        return getAllVideos(res.nextPageToken, newItems, count + 1)
    } else {
        return newItems
    }
}

(async function () {
    const allVideos = await Promise.resolve(getAllVideos("", [], 0));
    const albumReviews = allVideos.flatMap(v => v.snippet.title.endsWith("ALBUM REVIEW") ?
        [v.snippet] : [])
    console.log(albumReviews)
})();
