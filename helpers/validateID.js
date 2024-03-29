import mongoose from "mongoose";

import HttpError from "./HttpError.js";

const { ObjectId } = mongoose.Types;

const validateID = (req, res, next) => {
  if (!ObjectId.isValid(req.params.waterRecordId)) {
    next(HttpError(400, "Not valid id"));
  }
  next();
};

export default validateID;
