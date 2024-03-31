import * as waterServices from "../services/waterServices.js";

export const createWaterIntakeRecord = async (req, res, next) => {
  const { data, ml } = req.body;

  const consumedAt = new Date(`${data}:00.000Z`);
  const entryDate = new Date(`${data}:00.000Z`);

  entryDate.setUTCHours(0, 0, 0, 0);

  const { dailyWaterGoal, _id } = req.user;

  const params = {
    entryDate,
    userId: _id,
  };

  try {
    const newConsumedWaterPercentage = (ml / dailyWaterGoal) * 100;

    const payload = {
      ml,
      consumedAt,
      newConsumedWaterPercentage,
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

export const deleteWaterIntakeRecord = async (req, res, next) => {
  try {
    res.send("Water record was deleted.");
  } catch (error) {
    next(error);
  }
};
