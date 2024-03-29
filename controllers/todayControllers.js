// import HttpError from "../helpers/HttpError.js";

export const getTodayWaterRecord = async (req, res, next) => {
  try {
    res.send("Today water record was got.");
  } catch (error) {
    next(error);
  }
};
