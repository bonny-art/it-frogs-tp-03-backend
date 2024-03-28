const { waterRecordServices } = require("../services/waterRecordServices");

const getCurrentDay = async (req, res) => {
    try {
      const { entryDate } = req.params;
      const {userId} = req.params;
      const dailyWater = await waterRecordServices.getCurrentDay(entryDate, userId);
      
      if (!dailyWater) {
        return res.json({ waterIntakes: [], consumedWaterPercentage: 0 });
      }
      
      res.json(dailyWater);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  module.exports = {getCurrentDay};