// import HttpError from "../helpers/HttpError.js";

export const getMonthWaterRecords = async (req, res, next) => {
  try {
    res.send("Month water records was got.");
  } catch (error) {
    next(error);
  }
};
