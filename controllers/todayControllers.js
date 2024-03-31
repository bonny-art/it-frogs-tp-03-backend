// import HttpError from "../helpers/HttpError.js";
import * as waterServices from "../services/waterServices.js";

export const getTodayWaterRecord = async (req, res, next) => {
  const entryDate = new Date(req.query.date);

  const userId = req.user._id;
  const { dailyWaterGoal } = req.user;

  const params = {
    entryDate,
    userId,
  };

  const update = {
    $setOnInsert: { entryDate, dailyWaterGoal },
  };

  const options = {
    new: true,
    upsert: true,
  };

  try {
    const dailyWater = await waterServices.findOrCreateWaterRecord(
      params,
      update,
      options
    );

    res.send(dailyWater);
  } catch (error) {
    next(error);
  }
};
