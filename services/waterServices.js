import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

import { WaterRecord } from "../db/models/WaterRecord.js";

export const findWaterRecord = async (params) => {
  const waterRecord = await WaterRecord.findOne(params);

  return waterRecord;
};

export const updateWaterRecord = async (params, payload) => {
  const waterRecord = await WaterRecord.findOneAndUpdate(params, payload, {
    new: true,
    runValidators: true,
  });

  return waterRecord;
};

export const findOrCreateAndUpdateWaterRecord = async (
  params,
  update,
  options
) => {
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
  const { ml, consumedAt, waterPercentage } = payload;

  const waterRecord = await WaterRecord.findOneAndUpdate(
    params,
    {
      $inc: {
        consumedWater: +ml,
        consumedTimes: +1,
      },
      $push: { waterIntakes: { ml, consumedAt } },
      $set: { consumedWaterPercentage: waterPercentage },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return waterRecord;
};

export const updateWaterIntake = async (params, payload) => {
  const { _id, ml, consumedAt, waterPercentage, consumedWater } = payload;

  const waterRecord = await WaterRecord.findOneAndUpdate(
    params,
    {
      $set: {
        consumedWaterPercentage: waterPercentage,
        consumedWater,
        "waterIntakes.$[elem].ml": ml,
        "waterIntakes.$[elem].consumedAt": consumedAt,
      },
    },
    {
      arrayFilters: [{ "elem._id": _id }],
      new: true,
      runValidators: true,
    }
  );

  return waterRecord;
};

export const removeWaterIntake = async (params, payload) => {
  const { _id, ml, waterPercentage } = payload;

  const waterRecord = await WaterRecord.findOneAndUpdate(
    params,
    {
      $inc: {
        consumedWater: -ml,
        consumedTimes: -1,
      },
      $pull: { waterIntakes: { _id } },
      $set: { consumedWaterPercentage: waterPercentage },
    },
    { new: true }
  );

  return waterRecord;
};

export const getMonthWaterRecords = async (userId, startDate, endDate) => {
  const waterRecords = await WaterRecord.find(
    {
      userId: userId,
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
  )
    .sort({ entryDate: 1 })
    .lean();

  return waterRecords;
};
