import * as Mongoose from 'mongoose';
import ReviewSchema from './reviews.schema';
import { IReviewDocument, IReviewModel } from './reviews.types';

export const ReviewModel = Mongoose.model<IReviewDocument>(
  'review',
  ReviewSchema
) as IReviewModel;
