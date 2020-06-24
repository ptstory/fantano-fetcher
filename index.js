"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
require('dotenv').config();
var google = require('googleapis').google;
var fs = require("fs");
var youtube = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY,
});
function getVideos(pageToken) {
    return __awaiter(this, void 0, void 0, function () {
        var params, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        playlistId: "UUt7fwAhXDy3oNFTAzF2o8Pw",
                        part: 'snippet',
                        maxResults: 50,
                        pageToken: pageToken
                    };
                    return [4 /*yield*/, youtube.playlistItems.list(params)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, {
                            totalResults: res.data.pageInfo.totalResults,
                            videos: res.data.items,
                            nextPageToken: res.data.nextPageToken
                        }];
            }
        });
    });
}
function getAllVideos(nextPageToken, items, count) {
    return __awaiter(this, void 0, void 0, function () {
        var res, newItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getVideos(nextPageToken)];
                case 1:
                    res = _a.sent();
                    newItems = items.concat(res.videos);
                    // if (count < 1) {
                    if (count < res.totalResults / 50) {
                        return [2 /*return*/, getAllVideos(res.nextPageToken, newItems, count + 1)];
                    }
                    else {
                        return [2 /*return*/, newItems];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getRating(review) {
    if (review.includes("CLASSIC"))
        return "CLASSIC/10";
    if (review.includes("NOT GOOD"))
        return "NOT GOOD/10";
    var regex = /[0-9][10]*\/[1][0]/g;
    var rating = review.match(regex) || "??/??";
    return rating[0];
}
function getArtist(review) {
    if (review.resourceId.videoId === "F-Fd5YG2pWs")
        return;
    if (review.resourceId.videoId === "MNnibsPJSDY")
        return;
    if (review.resourceId.videoId === "LDMNhCOs0G0")
        return;
    var regex = /.*(?=-)/g;
    var artist = review.title.trim().match(regex);
    return artist[0].replace(/\s*$/, "");
}
function getAlbum(review) {
    if (review.resourceId.videoId === "F-Fd5YG2pWs")
        return;
    if (review.resourceId.videoId === "MNnibsPJSDY")
        return;
    if (review.resourceId.videoId === "LDMNhCOs0G0")
        return;
    var regex = /(?<=-).*/g;
    var album = review.title.trim().match(regex);
    // .replace("ALBUM REVIEW", "")
    return album[0].replace(/\s*$/, "");
}
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var allVideos, albumReviews, snippets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve(getAllVideos("", [], 0))];
                case 1:
                    allVideos = _a.sent();
                    albumReviews = allVideos.flatMap(function (v) { return v.snippet.title.endsWith("ALBUM REVIEW") ?
                        [v.snippet] : []; });
                    snippets = albumReviews.map(function (review) { return ({
                        date: review.publishedAt.substring(0, 10),
                        url: "youtube.com/watch?v=" + review.resourceId.videoId,
                        artist: getArtist(review),
                        album: getAlbum(review),
                        rating: getRating(review.description)
                    }); });
                    return [2 /*return*/];
            }
        });
    });
})();
