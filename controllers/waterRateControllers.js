import * as waterRecordServices from "../services/waterServices.js";
import * as userServices from "../services/userServices.js";

// TODO make waterRate controller

export const updateWaterRate = async (req, res, next) => {
    const { dailyWaterGoal } = req.body;
    const userId = req.user._id;
    const entryDate = new Date(req.query.date);
  
    const params = {
      entryDate,
      userId,
    };
  
    try {
      const dailyWater = await waterRecordServices.findWaterRecord(params);
  
      const consumedWaterPercentage = dailyWater
        ? (dailyWater.consumedWater / dailyWaterGoal) * 100
        : 0;
  
      const newDailyWater = await waterRecordServices.updateWaterRecord(params, {
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
