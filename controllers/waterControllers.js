import HttpError from "../helpers/HttpError.js";
import * as waterServices from "../services/waterServices.js";

export const addWaterIntakeRecord = async (req, res, next) => {
  const { data, ml } = req.body;

  const consumedAt = new Date(`${data}:00.000Z`);
  const entryDate = new Date(`${data}:00.000Z`);

  entryDate.setUTCHours(0, 0, 0, 0);

  const { dailyWaterGoal, _id } = req.user;

  const params = {
    entryDate,
    userId: _id,
  };

  const update = {
    $setOnInsert: { entryDate, dailyWaterGoal },
  };

  const options = {
    new: true,
    upsert: true,
  };

  try {
    const dailyWater = await waterServices.findOrCreateAndUpdateWaterRecord(
      params,
      update,
      options
    );

    const waterPercentage =
      ((dailyWater.consumedWater + ml) / dailyWater.dailyWaterGoal) * 100;

    const payload = {
      ml,
      consumedAt,
      waterPercentage,
    };

    const newDailyWater = await waterServices.addWaterIntake(params, payload);

    res.send({ newDailyWater });
  } catch (error) {
    next(error);
  }
};

export const updateWaterIntakeRecord = async (req, res, next) => {
  try {
    res.send("Water record was updated.");
  } catch (error) {
    next(error);
  }
};

export const removeWaterIntakeRecord = async (req, res, next) => {};
