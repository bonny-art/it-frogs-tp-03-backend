import * as waterServices from "../services/waterServices.js";
import * as userServices from "../services/userServices.js";

/**
 * Controller for updating the user's daily water consumption rate.
 *
 * @param {Object} req - The request object containing the new daily water goal and the date query.
 * @param {Object} res - The response object used to send the updated user and daily water information.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Extracts the new daily water goal from the request body.
 * 2. Retrieves the user's ID from the authenticated user's information.
 * 3. Parses the entry date from the request query and creates a date object.
 * 4. Constructs a search parameter object with the entry date and user ID.
 * 5. Retrieves the user's daily water record for the given date from the database.
 * 6. Calculates the consumed water percentage based on the new daily goal and existing consumption.
 * 7. Updates the daily water record in the database with the new goal and consumption percentage.
 * 8. Updates the user's profile with the new daily water goal.
 * 9. Extracts the user's email, name, gender, and avatar URL from the updated user profile.
 * 10. Sends a response with the updated user profile and daily water record.
 *
 * If any errors occur, such as database connection issues or record update failures,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const updateWaterRate = async (req, res, next) => {
  const { dailyWaterGoal } = req.body;
  const userId = req.user._id;
  const entryDate = new Date(req.query.date);

  const params = {
    entryDate,
    userId,
  };

  try {
    const dailyWater = await waterServices.findWaterRecord(params);

    const consumedWaterPercentage = dailyWater
      ? (dailyWater.consumedWater / dailyWaterGoal) * 100
      : 0;

    const newDailyWater = await waterServices.updateWaterRecord(params, {
      dailyWaterGoal,
      consumedWaterPercentage,
    });

    const user = await userServices.updateUser(userId, {
      dailyWaterGoal,
    });

    const { email, name, gender, avatarURL } = user;

    res.send({
      user: {
        email,
        name,
        gender,
        dailyWaterGoal: user.dailyWaterGoal,
        avatarURL,
      },
      newDailyWater,
    });
  } catch (error) {
    next(error);
  }
};
