const {WaterRecord} = require("../db/models/WaterRecord");

const getCurrentDay = async (entryDate, userId) => {
    return await WaterRecord.findOne({entryDate, userId})
  };

  module.exports = {getCurrentDay};