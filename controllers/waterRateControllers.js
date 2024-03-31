import * as waterServices from "../services/waterServices.js";
import * as userServices from "../services/userServices.js";

export const updateWaterRate = async (req, res, next) => {
  const { dailyWaterGoal } = req.body;
  const userId = req.user._id;
  const entryDate = new Date(req.query.date);

  const params = {
    entryDate,
    userId,
  };

  try {
    const dailyWater = await waterServices.findWaterRecord(params);

    const consumedWaterPercentage = dailyWater
      ? (dailyWater.consumedWater / dailyWaterGoal) * 100
      : 0;

    const newDailyWater = await waterServices.updateWaterRecord(params, {
      dailyWaterGoal,
      consumedWaterPercentage,
    });

    const user = await userServices.updateUser(userId, {
      dailyWaterGoal,
    });

    res.send({ user, newDailyWater });
  } catch (error) {
    next(error);
  }
};

