import { getMonthWaterRecords } from "../services/waterServices.js";

export const getMonthWater = async (req, res) => {
  const {
    user,
    query: { startDate, endDate },
  } = req;

  try {
    if (!startDate || !endDate) {
      throw new Error(
        'Both "startDate" and "endDate" are required in the query'
      );
    }

    const selectedDates = await getMonthWaterRecords(
      user._id,
      startDate,
      endDate
    );

    const formattedDates = selectedDates.map((record) => {
      return {
        entryDate: record.entryDate,
        waterIntakes: 0,
        dailyWaterGoal: record.dailyWaterGoal,
        consumedWater: record.consumedWater,
        consumedTimes: record.consumedTimes,
        consumedWaterPercentage: record.consumedWaterPercentage,
      };
    });

    res.json(formattedDates);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
