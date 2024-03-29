const {WaterRecord} = require("../db/models/WaterRecord");

const waterRecordServices = async (entryDate, userId) => {
    return await WaterRecord.findOne({entryDate, userId})
  };

  module.exports = {waterRecordServices};