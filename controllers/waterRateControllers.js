import { waterRecordServices } from "../services/waterRecordServices";

export const findWaterRecord = async (req, res, next) => {
  try {
    const { date, dailyWaterGoal } = req.body;
    const dailyWater = await waterRecordServices.findWaterRecord(date, dailyWaterGoal);

    if (dailyWater) {
      const consumedWaterPercentage = (dailyWater.consumedWater / dailyWaterGoal) * 100;

      dailyWater.consumedWaterPercentage = consumedWaterPercentage;

      await waterRecordServices.updateWaterRecord(
        { entryDate, userId: req.user._id },
        { consumedWaterPercentage, dailyWaterGoal }
      );

      await waterRecordServices.recordUserWaterGoal(req.user._id, dailyWaterGoal);

      res.json(dailyWater);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    next(error);
  }
};

