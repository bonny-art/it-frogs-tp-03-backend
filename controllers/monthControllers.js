// import { getMonthWaterRecords } from "../services/waterServices.js";
import * as waterServices from "../services/waterServices.js";

export const getMonthWaterRecords = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const userId = req.user._id;

  try {
    const waterRecords = await waterServices.getMonthWaterRecords(
      userId,
      startDate,
      endDate
    );

    res.send(waterRecords);
  } catch (error) {
    next(error);
  }
};
