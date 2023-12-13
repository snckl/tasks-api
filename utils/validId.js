import mongoose from 'mongoose';
import AppError from './appError.js';

const isValidId = (id, next, place) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    next(new AppError(`${place} could not found with provided id.`, 404));
    return;
  }
};

export default isValidId;
