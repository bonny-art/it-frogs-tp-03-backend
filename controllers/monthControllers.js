// import { getMonthWaterRecords } from "../services/waterServices.js";
import * as waterServices from "../services/waterServices.js";

/**
 * Controller for retrieving a user's water consumption records for a specific month.
 *
 * @param {Object} req - The request object containing the start and end dates for the query.
 * @param {Object} res - The response object used to send back the water records data.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Extracts the start and end dates from the request query parameters.
 * 2. Retrieves the user's ID from the request's user object.
 * 3. Calls the water service to get the water records for the user between the specified dates.
 * 4. Sends the retrieved water records data as a response.
 *
 * If any errors occur, such as issues with retrieving data from the database,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const getMonthWaterRecords = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const userId = req.user._id;

  try {
    const waterRecords = await waterServices.getMonthWaterRecords(
      userId,
      startDate,
      endDate
    );

    res.send(waterRecords);
  } catch (error) {
    next(error);
  }
};
