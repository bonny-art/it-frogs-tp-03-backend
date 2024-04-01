import HttpError from "../helpers/HttpError.js";
import * as waterServices from "../services/waterServices.js";

// Function for adding a new intake of water
// If there is no record for today, it will create it and add a new intake
// If there is a record, it will add new intake to the existing record

export const addWaterIntakeRecord = async (req, res, next) => {
  const { data, ml } = req.body;

  const consumedAt = new Date(`${data}:00.000Z`);
  const entryDate = new Date(`${data}:00.000Z`);

  entryDate.setUTCHours(0, 0, 0, 0);

  const { dailyWaterGoal, _id } = req.user;

  const params = {
    entryDate,
    userId: _id,
  };

  const update = {
    $setOnInsert: { entryDate, dailyWaterGoal },
  };

  const options = {
    new: true,
    upsert: true,
  };

  try {
    const dailyWater = await waterServices.findOrCreateAndUpdateWaterRecord(
      params,
      update,
      options
    );

    const waterPercentage =
      ((dailyWater.consumedWater + ml) / dailyWater.dailyWaterGoal) * 100;

    const payload = {
      ml,
      consumedAt,
      waterPercentage,
    };

    const newDailyWater = await waterServices.addWaterIntake(params, payload);

    res.send({ newDailyWater });
  } catch (error) {
    next(error);
  }
};

// Function of changing the water intake:
// amount of water and/or time of intake
// If there is no record on this day, an error will be returned
// If there is no water intake with this id on this day, an error will be returned

export const updateWaterIntakeRecord = async (req, res, next) => {
  const { data, ml } = req.body;
  const { waterRecordId } = req.params;

  const entryDate = new Date(`${data}:00.000Z`);
  entryDate.setUTCHours(0, 0, 0, 0);

  const consumedAt = new Date(`${data}:00.000Z`);

  const { _id } = req.user;

  const params = {
    entryDate,
    userId: _id,
  };

  try {
    const dailyWater = await waterServices.findWaterRecord(params);

    if (!dailyWater) {
      throw HttpError(404, "There are no records on this day");
    }

    const { waterIntakes } = dailyWater;

    const waterIntake = waterIntakes.find(
      ({ _id }) => String(_id) === waterRecordId
    );

    if (!waterIntake) {
      throw HttpError(404, "There is no such record of water intake");
    }

    const consumedWater = dailyWater.consumedWater - waterIntake.ml + ml;

    const waterPercentage = (consumedWater / dailyWater.dailyWaterGoal) * 100;

    const payload = {
      _id: waterIntake._id,
      ml,
      consumedAt,
      waterPercentage,
      consumedWater,
    };

    const newDailyWater = await waterServices.updateWaterIntake(
      params,
      payload
    );

    res.send({ newDailyWater });
  } catch (error) {
    next(error);
  }
};

// Function of deleting water intake
// If there is no record on this day, an error will be returned
// If there is no water intake with this id on this day, it will return an error

export const removeWaterIntakeRecord = async (req, res, next) => {
  const { data } = req.body;
  const { waterRecordId } = req.params;

  const entryDate = new Date(`${data}:00.000Z`);
  entryDate.setUTCHours(0, 0, 0, 0);

  const { _id } = req.user;

  const params = {
    entryDate,
    userId: _id,
  };

  try {
    const dailyWater = await waterServices.findWaterRecord(params);

    if (!dailyWater) {
      throw HttpError(404, "There are no records on this day");
    }

    const { waterIntakes } = dailyWater;

    const waterIntake = waterIntakes.find(
      ({ _id }) => String(_id) === waterRecordId
    );

    if (!waterIntake) {
      throw HttpError(404, "There is no such record of water intake");
    }

    const waterPercentage =
      ((dailyWater.consumedWater - waterIntake.ml) /
        dailyWater.dailyWaterGoal) *
      100;

    const payload = {
      _id: waterIntake._id,
      ml: waterIntake.ml,
      waterPercentage,
    };

    const newDailyWater = await waterServices.removeWaterIntake(
      params,
      payload
    );

    res.send({ newDailyWater });
  } catch (error) {
    next(error);
  }
};
