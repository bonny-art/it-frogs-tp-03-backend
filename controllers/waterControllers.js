import HttpError from "../helpers/HttpError.js";
import * as waterServices from "../services/waterServices.js";

/**
 * Controller for adding a water intake record for a user.
 *
 * @param {Object} req - The request object containing the date and milliliters of water intake.
 * @param {Object} res - The response object used to send back the updated water intake data.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Parses the date and water intake amount (in milliliters) from the request body.
 * 2. Creates a Date object for the consumed time and the entry date based on the provided data.
 * 3. Sets the entry date's time to the start of the day (UTC) for consistent daily tracking.
 * 4. Retrieves the user's daily water goal and ID from the request's user object.
 * 5. Constructs the parameters and update object for the database query, ensuring the entry date and daily water goal are set on insert.
 * 6. Sets the options for the database operation to return the new document, upsert, and run validators.
 * 7. Calls the water service to find, create, or update the water record with the given parameters.
 * 8. Calculates the new total water percentage based on the added intake and the daily goal.
 * 9. Constructs the payload with the new intake amount, consumed time, and water percentage.
 * 10. Adds the water intake to the user's record and retrieves the updated document.
 * 11. Sends a response with the new daily water record.
 *
 * If any errors occur, such as issues with the database operation,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const addWaterIntakeRecord = async (req, res, next) => {
  const { date, ml, timeZoneOffset } = req.body;

  const isoDate = new Date(date);
  console.log("🚀 ~ isoDate:", isoDate);
  isoDate.setMinutes(isoDate.getMinutes() - timeZoneOffset);
  console.log("🚀 ~ isoDate:", isoDate);

  const isoString = isoDate.toISOString();
  console.log("🚀 ~ isoString:", isoString);
  const consumedAt = new Date(isoString.replace(/\.\d{3}/, ".000"));
  console.log("🚀 ~ consumedAt:", consumedAt);

  const entryDate = new Date(new Date(isoString));
  console.log("🚀 ~ entryDate:", entryDate);
  entryDate.setUTCHours(0, 0, 0, 0);
  console.log("🚀 ~ entryDate:", entryDate);

  const { dailyWaterGoal, _id } = req.user;
  console.log("req.user :>> ", req.user);
  console.log("🚀 ~ dailyWaterGoal:", dailyWaterGoal);

  const params = {
    entryDate,
    userId: _id,
  };

  const update = {
    $setOnInsert: { entryDate, dailyWaterGoal },
  };
  console.log("🚀 ~ update:", update);

  const options = {
    new: true,
    // upsert: true,
    runValidators: true,
  };

  try {
    const dailyWater = await waterServices.findOrCreateAndUpdateWaterRecord(
      params,
      update,
      options
    );
    console.log("🚀 ~ dailyWater111:", dailyWater);

    const waterPercentage = Math.round(
      ((dailyWater.consumedWater + ml) / dailyWater.dailyWaterGoal) * 100
    );

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

/**
 * Controller for updating a user's water intake record.
 *
 * @param {Object} req - The request object containing the date, milliliters of water intake, and the water record ID.
 * @param {Object} res - The response object used to send back the updated water intake data.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Parses the date and water intake amount (in milliliters) from the request body.
 * 2. Retrieves the water record ID from the request parameters.
 * 3. Creates a Date object for the entry date based on the provided data and sets the time to the start of the day (UTC).
 * 4. Retrieves the user's ID from the request's user object.
 * 5. Constructs the parameters for the database query with the user's ID and entry date.
 * 6. Calls the water service to find the existing water record for the given date.
 * 7. If no record is found for the day, throws a 404 HTTP error.
 * 8. Finds the specific water intake record within the day's records using the provided ID.
 * 9. If no specific water intake record is found, throws a 404 HTTP error.
 * 10. Calculates the updated total consumed water and water percentage based on the new intake.
 * 11. Constructs the payload with the updated intake information.
 * 12. Calls the water service to update the water intake record with the new data.
 * 13. Sends a response with the updated daily water record.
 *
 * If any errors occur, such as issues with finding the record or database update problems,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const updateWaterIntakeRecord = async (req, res, next) => {
  const { waterRecordId } = req.params;

  const { date, ml, timeZoneOffset } = req.body;

  const isoDate = new Date(date);
  console.log("🚀 ~ isoDate:", isoDate);
  isoDate.setMinutes(isoDate.getMinutes() - timeZoneOffset);
  console.log("🚀 ~ isoDate:", isoDate);

  const isoString = isoDate.toISOString();
  console.log("🚀 ~ isoString:", isoString);
  const consumedAt = new Date(isoString.replace(/\.\d{3}/, ".000"));
  console.log("🚀 ~ consumedAt:", consumedAt);

  const entryDate = new Date(new Date(isoString));
  console.log("🚀 ~ entryDate:", entryDate);
  entryDate.setUTCHours(0, 0, 0, 0);
  console.log("🚀 ~ entryDate:", entryDate);

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

    const waterPercentage = Math.round(
      (consumedWater / dailyWater.dailyWaterGoal) * 100
    );

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

/**
 * Controller for removing a water intake record.
 *
 * @param {Object} req - The request object containing the user's data and water record ID.
 * @param {Object} res - The response object used to send the updated daily water record.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Parses the date from the request body and normalizes it to UTC midnight.
 * 2. Extracts the user's ID from the request object.
 * 3. Constructs a search parameter object with the normalized date and user ID.
 * 4. Retrieves the user's daily water record from the database using the search parameters.
 * 5. If no daily record is found, throws a 404 HTTP error indicating no records for the day.
 * 6. Searches for the specific water intake record within the daily record using the provided ID.
 * 7. If the specific water intake record is not found, throws a 404 HTTP error indicating the record is missing.
 * 8. Calculates the new water consumption percentage after removing the water intake record.
 * 9. Prepares the payload with the ID, milliliters, and new water percentage.
 * 10. Updates the daily water record in the database with the new information.
 * 11. Sends a response with the updated daily water record.
 *
 * If any errors occur, such as database connection issues or record update failures,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const removeWaterIntakeRecord = async (req, res, next) => {
  const { waterRecordId } = req.params;
  const { date, timeZoneOffset } = req.body;

  const isoDate = new Date(date);
  console.log("🚀 ~ isoDate:", isoDate);
  isoDate.setMinutes(isoDate.getMinutes() - timeZoneOffset);
  console.log("🚀 ~ isoDate:", isoDate);

  try {
    const isoString = isoDate.toISOString();

    console.log("🚀 ~ isoString:", isoString);

    const entryDate = new Date(new Date(isoString));
    console.log("🚀 ~ entryDate:", entryDate);
    entryDate.setUTCHours(0, 0, 0, 0);
    console.log("🚀 ~ entryDate:", entryDate);

    const { _id } = req.user;

    const params = {
      entryDate,
      userId: _id,
    };

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

    const waterPercentage = Math.round(
      ((dailyWater.consumedWater - waterIntake.ml) /
        dailyWater.dailyWaterGoal) *
        100
    );

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
