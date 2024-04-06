// import HttpError from "../helpers/HttpError.js";
import * as waterServices from "../services/waterServices.js";

/**
 * Controller for obtaining or creating a user's water record for the current day.
 *
 * @param {Object} req - The request object containing the date query parameter.
 * @param {Object} res - The response object used to send back the daily water record data.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Converts the date received in the query parameters to a Date object.
 * 2. Retrieves the user's ID and daily water goal from the request's user object.
 * 3. Constructs the parameters for the database query with the user's ID and entry date.
 * 4. Defines the update operation to set the entry date and daily water goal on insert.
 * 5. Sets the options for the database operation to return the new document, upsert, and run validators.
 * 6. Calls the water service to find, create, or update the water record with the given parameters.
 * 7. Sends the daily water record data as a response.
 *
 * If any errors occur, such as issues with the database operation,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const getTodayWaterRecord = async (req, res, next) => {
  const entryDate = new Date(req.query.date);

  const userId = req.user._id;
  const { dailyWaterGoal } = req.user;

  const params = {
    entryDate,
    userId,
  };

  const update = {
    $setOnInsert: { entryDate, dailyWaterGoal },
  };

  const options = {
    new: true,
    upsert: true,
    runValidators: true,
  };

  try {
    const dailyWater = await waterServices.findOrCreateAndUpdateWaterRecord(
      params,
      update,
      options
    );

    res.send(dailyWater);
  } catch (error) {
    next(error);
  }
};
