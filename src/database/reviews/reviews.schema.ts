import * as Mongoose from 'mongoose';

const ReviewSchema = new Mongoose.Schema({
    date: String,
    url: String,
    artist: String,
    album: String,
    rating: String,
    genres: [String],
    dateOfEntry: {
        type: Date,
        default: new Date(),
    }
});

export default ReviewSchema;
