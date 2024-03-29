import { waterRecordServices } from "../services/waterRecordServices";

import waterSchema from "./waterSchema";

export const changeDailyGoal = async (req, res, next) => {
  try {
    const { error } = waterSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { entryDate, userId } = req.params;
    const dailyWater = await waterRecordServices.changeDailyGoal(
      entryDate,
      userId
    );

    if (!dailyWater) {
      return res.json({ waterIntakes: [], consumedWaterPercentage: 0 });
    }

    const totalWaterIntake = dailyWater.waterIntakes.reduce(
      (total, intake) => total + intake.amount,
      0
    );

    const dailyGoalPercentage = (totalWaterIntake / dailyWater.dailyGoal) * 100;

    dailyWater.consumedWaterPercentage = dailyGoalPercentage;

    await waterRecordServices.updateDailyGoalPercentage(
      entryDate,
      userId,
      dailyGoalPercentage
    );

    res.json(dailyWater);
  } catch (error) {
    console.error("An error occurred:", error);
    next(error);
  }
};
