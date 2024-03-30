import {getMonthWaterRecords} from "../services/waterServices.js";

export const getMonthWater = async (req, res) => {
  const { user, params: { startDate, endDate } } = req;

  try {
    const selectedDates = await getMonthWaterRecords(user._id, startDate, endDate);

    const formattedDates = selectedDates.map(({ entryDate, waterIntakes, dailyWaterGoal, consumedWater, consumedTimes, consumedWaterPercentage }) => ({
      entryDate: new Date(entryDate),
      waterIntakes: waterIntakes.reduce((total, intake) => total + intake.ml, 0) / 1000,
      dailyWaterGoal: Array.isArray(dailyWaterGoal) ? dailyWaterGoal.length : 0, 
      consumedWater,
      consumedTimes,
      consumedWaterPercentage
    }));

    res.json(formattedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера" }); 
  }
};


// export const getMonthWaterRecords = async (req, res, next) => {
//   const { startDate, endDate } = req.params;
//   const userId = req.user._id;
//   try {
//     res.send("Month water records was got.");
//   } catch (error) {
//     next(error);
//   }
// };
