import { waterRecordServices } from "../services/waterRecordServices";


export const changeDailyGoal = async (req, res, next) => {
  try {
    const { entryDate } = req.body;
    const dailyWater = await waterRecordServices.changeDailyGoal(
      entryDate,
      req.user._id
    );
  
    if (dailyWater) {
      const newWaterGoal = dailyWater.waterIntakes.reduce(
        (total, intake) => total + intake.amount, 0);

      const dailyGoalPercentage = (newWaterGoal / dailyWater.dailyGoal) * 100;

      dailyWater.consumedWaterPercentage = dailyGoalPercentage;

      await waterRecordServices.updateWaterRecord(
        { entryDate, userId },
        { dailyGoalPercentage, newWaterGoal }
      );

      res.json(dailyWater);
    }


  } catch (error) {
    console.error("An error occurred:", error);
    next(error);
  }
};

// import HttpError from "../helpers/HttpError.js";

// export const updateWaterRate = async (req, res, next) => {
//   try {
//     res.send("Water rate was updated.");
//   } catch (error) {
//     next(error);
//   }
// };
