"use strict"

require('dotenv').config()
const { google } = require('googleapis');
const fs = require("fs");

//Start and End Dates for specific genre format
const fromDate = new Date("2011-06-28")
const toDate = new Date("2012-01-06")

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
    // if (count < 1) {
    if (count < res.totalResults / 50) {
        return getAllVideos(res.nextPageToken, newItems, count + 1)
    } else {
        return newItems
    }
}

function getRating(review) {
    if (review.includes("CLASSIC")) return "CLASSIC/10"
    if (review.includes("NOT GOOD")) return "NOT GOOD/10"
    
    const regex = /[0-9][10]*\/[1][0]/g;
    const rating = review.match(regex) || "??/??";
    return rating[0];
}

function getArtist(review) {
    if (review.resourceId.videoId === "F-Fd5YG2pWs") return
    if (review.resourceId.videoId === "MNnibsPJSDY") return
    if (review.resourceId.videoId === "LDMNhCOs0G0") return
    
    const regex = /.*(?=-)/g;
    const artist = review.title.trim().match(regex);
    return artist[0].replace(/\s*$/,"");
}

function getGenres(review) {
    const formattedDesc = review.description.replace(/(?:https?):\/\/[\n\S]+/g, '')
    .replace('(THIS VIDEO IS A REUPLOAD. THE ORIGINAL HAD AN EDITING MISTAKE I WANTED TO FIX)', "");
    const reviewDate = new Date(review.publishedAt.substring(0, 10))
    
    if (reviewDate <= toDate) {
        if (reviewDate >= fromDate) {
            return formattedDesc.substring(
                formattedDesc.lastIndexOf('/'),
                formattedDesc.length
            ).split(",").map(genre => genre.replace(/^\s+/g, ''))
        }
        return []
    }

    let genres = formattedDesc.substring(
        formattedDesc.lastIndexOf('/', formattedDesc.lastIndexOf('/')-1) + 1,
        formattedDesc.lastIndexOf('/') - 1
    ).trim().split(",").map(genre => genre.replace(/^\s+/g, ''))

    return genres[0].includes("Listen: ") ? genres : []
}

function getAlbum(review) {
    if (review.resourceId.videoId === "F-Fd5YG2pWs") return
    if (review.resourceId.videoId === "MNnibsPJSDY") return
    if (review.resourceId.videoId === "LDMNhCOs0G0") return

    const regex = /(?<=-).*/g;
    const album = review.title.trim().match(regex)
        // .replace("ALBUM REVIEW", "")
    return album[0].replace(/\s*$/,"");
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
        rating: getRating(review.description),
        genres: getGenres(review)
    })).sort((a, b) => new Date(b.date) - new Date(a.date))

    // fs.writeFile("reviews.json", JSON.stringify(snippets), function(err){
    //     if (err){
    //         console.log(err)
    //     }
    // })

})();
