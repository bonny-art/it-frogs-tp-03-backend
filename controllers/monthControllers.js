import { getMonthWaterRecords } from "../services/waterServices.js";

export const getMonthWater = async (req, res) => {
  const date = new Date();
  const {
    user,
    query: {
      year = date.getFullYear(),
      month = date.toLocaleString("en", { month: "long" }),
    },
  } = req;

  try {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const selectedDates = await getMonthWaterRecords(
      user._id,
      startDate,
      endDate
    );

    const formattedDates = selectedDates.map((record) => ({
      ...record,
      entryDate: record.entryDate.toISOString(),
      waterRate: record.dailyWaterGoal / 1000,
      dailyEntries: record.waterIntakes.length,
    }));

    res.json(formattedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
