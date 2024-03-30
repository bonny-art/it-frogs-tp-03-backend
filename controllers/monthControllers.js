// import HttpError from "../helpers/HttpError.js";

export const getMonthWaterRecords = async (req, res, next) => {
  const { startDate, endDate } = req.params;
  const userId = req.user._id;
  try {
    res.send("Month water records was got.");
  } catch (error) {
    next(error);
  }
};
