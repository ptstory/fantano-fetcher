import { Document, Model } from 'mongoose';
import { Review } from '../../interfaces/review.interface';


export interface IReviewDocument extends Review, Document {}

export interface IReviewModel extends Model<IReviewDocument> {}
