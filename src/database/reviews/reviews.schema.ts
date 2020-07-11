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
    },
    albumCover: {
        type: String,
        trim: true,
        default: 'https://i2.wp.com/www.wmhbradio.org/wp-content/uploads/2016/07/albumcover-placeholder.jpg?fit=250%2C250&ssl=1'

    }
});

export default ReviewSchema;
