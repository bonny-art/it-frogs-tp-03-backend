import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

import { WaterRecord } from "../db/models/WaterRecord.js";

// TODO make findWaterRecord and updateWaterRecord services

export const findOrCreateWaterRecord = async (params, update, options) => {
  const waterRecord = await WaterRecord.findOneAndUpdate(
    params,
    update,
    options
  ).exec();

  return waterRecord;
};

export const createWaterRecord = async (payload) => {
  const newWaterRecord = new WaterRecord(payload);
  const waterRecord = await newWaterRecord.save();

  return waterRecord;
};

export const addWaterIntake = async (params, payload) => {
  const { ml, consumedAt, newConsumedWaterPercentage } = payload;

  const waterRecord = await WaterRecord.findOneAndUpdate(
    params,
    {
      $inc: {
        consumedWater: +ml,
        consumedTimes: +1,
        consumedWaterPercentage: +newConsumedWaterPercentage,
      },
      $push: { waterIntakes: { ml, consumedAt } },
    },
    { new: true }
  );

  return waterRecord;
};

export const getMonthWaterRecords = async (userId, startDate, endDate) => {
  const waterRecords = await WaterRecord.find(
    {
      userId: ObjectId(userId),
      entryDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    },
    {
      entryDate: 1,
      dailyWaterGoal: 1,
      consumedWater: 1,
      consumedTimes: 1,
      consumedWaterPercentage: 1,
      _id: 0,
    }
  ).lean();

  return waterRecords;
};