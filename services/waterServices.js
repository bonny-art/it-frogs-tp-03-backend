import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

import { WaterRecord } from "../db/models/WaterRecord.js";

/**
 * Service for retrieving a water record from the database.
 *
 * @param {Object} params - The search parameters used to find the water record.
 * @returns {Object} The water record object that matches the search criteria.
 *
 * This function performs the following action:
 * 1. Calls the `findOne` method on the WaterRecord model, passing the search parameters.
 * 2. Awaits the database response and retrieves the water record document.
 * 3. Returns the water record object if found.
 *
 * If no water record matches the search criteria, the function will return null.
 */

export const findWaterRecord = async (params) => {
  const waterRecord = await WaterRecord.findOne(params);

  return waterRecord;
};

/**
 * Service for updating a water record in the database.
 *
 * @param {Object} params - The search parameters used to locate the water record.
 * @param {Object} payload - The data to be updated in the water record.
 * @returns {Object} The updated water record object.
 *
 * This function performs the following actions:
 * 1. Calls the `findOneAndUpdate` method on the WaterRecord model, passing the search parameters and the update payload.
 * 2. Sets the options to return the new updated object and to run schema validators on the update operation.
 * 3. Awaits the completion of the update operation.
 * 4. Returns the updated water record object.
 *
 * The returned water record object reflects the changes made based on the provided payload.
 */

export const updateWaterRecord = async (params, payload) => {
  const waterRecord = await WaterRecord.findOneAndUpdate(params, payload, {
    new: true,
    runValidators: true,
  });

  return waterRecord;
};

/**
 * Service for finding, creating, or updating a water record in the database.
 *
 * @param {Object} params - The search parameters used to locate or create the water record.
 * @param {Object} update - The data to be updated or used to create the water record.
 * @param {Object} options - The options to apply to the findOneAndUpdate method.
 * @returns {Object} The water record object that is found, created, or updated.
 *
 * This function performs the following actions:
 * 1. Calls the `findOneAndUpdate` method on the WaterRecord model, passing the search parameters, update data, and options.
 * 2. If a water record matching the search parameters exists, it is updated with the provided data.
 * 3. If no matching water record exists, a new one is created using the provided data.
 * 4. The options parameter allows for additional configurations such as returning the new object and running schema validators.
 * 5. Executes the query using the `exec` method.
 * 6. Returns the water record object that was found, created, or updated.
 *
 * This operation ensures that a water record is always present and up-to-date with the latest information.
 */

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

/**
 * Service for creating a new water record in the database.
 *
 * @param {Object} payload - The data to be used for creating the water record.
 * @returns {Object} The newly created water record object.
 *
 * This function performs the following actions:
 * 1. Creates a new instance of the WaterRecord model with the provided payload data.
 * 2. Saves the new water record instance to the database.
 * 3. Returns the newly created water record object.
 *
 * The returned water record object includes all the information necessary for tracking water consumption.
 */

export const createWaterRecord = async (payload) => {
  const newWaterRecord = new WaterRecord(payload);
  const waterRecord = await newWaterRecord.save();

  return waterRecord;
};

/**
 * Service for deleting multiple water records from the database.
 *
 * @param {Object} query - The query criteria used to select the water records for deletion.
 * @returns {Object} The result object containing information about the deletion operation.
 *
 * This function performs the following action:
 * 1. Calls the `deleteMany` method on the WaterRecord model, passing the query criteria.
 * 2. Awaits the database to perform the deletion operation on all records that match the query.
 * 3. Returns the result object, which includes details such as the number of records deleted.
 *
 * This operation is used to remove multiple water records in a single action, based on specified criteria.
 */

export const deleteWaterRecords = async (query) => {
  const result = await WaterRecord.deleteMany(query);

  return result;
};

/**
 * Service for adding a water intake record to a user's daily water record.
 *
 * @param {Object} params - The search parameters used to locate the user's daily water record.
 * @param {Object} payload - The data about the water intake to be added.
 * @returns {Object} The updated water record object with the new water intake entry.
 *
 * This function performs the following actions:
 * 1. Destructures the milliliters (ml), consumption time (consumedAt), and water percentage from the payload.
 * 2. Calls the `findOneAndUpdate` method on the WaterRecord model, passing the search parameters and update operations.
 * 3. Increments the consumedWater and consumedTimes fields by the specified ml and by 1, respectively.
 * 4. Pushes the new water intake entry into the waterIntakes array.
 * 5. Sets the consumedWaterPercentage to the new calculated percentage.
 * 6. Sets the options to return the updated document and to run validators on the update operation.
 * 7. Awaits the completion of the update operation.
 * 8. Returns the updated water record object, reflecting the new water intake.
 *
 * The operation ensures that the user's daily water consumption is accurately tracked and updated.
 */

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

/**
 * Service for updating an existing water intake record within a user's daily water record.
 *
 * @param {Object} params - The search parameters used to locate the user's daily water record.
 * @param {Object} payload - The data about the water intake to be updated.
 * @returns {Object} The updated water record object with the modified water intake entry.
 *
 * This function performs the following actions:
 * 1. Destructures the necessary fields (_id, ml, consumedAt, waterPercentage, consumedWater) from the payload.
 * 2. Calls the `findOneAndUpdate` method on the WaterRecord model, passing the search parameters and update operations.
 * 3. Sets the consumedWaterPercentage and consumedWater fields with the new values.
 * 4. Updates the specific water intake entry in the waterIntakes array using the arrayFilters option.
 * 5. Sets the options to return the updated document and to run validators on the update operation.
 * 6. Awaits the completion of the update operation.
 * 7. Returns the updated water record object, reflecting the changes made to the water intake.
 *
 * This operation ensures that the user's water intake record is accurately updated with the latest consumption details.
 */

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

/**
 * Service for removing a specific water intake entry from a user's daily water record.
 *
 * @param {Object} params - The search parameters used to locate the user's daily water record.
 * @param {Object} payload - The data about the water intake to be removed.
 * @returns {Object} The updated water record object with the water intake entry removed.
 *
 * This function performs the following actions:
 * 1. Destructures the necessary fields (_id, ml, waterPercentage) from the payload.
 * 2. Calls the `findOneAndUpdate` method on the WaterRecord model, passing the search parameters and update operations.
 * 3. Decrements the consumedWater and consumedTimes fields by the specified ml and by 1, respectively.
 * 4. Removes the specific water intake entry from the waterIntakes array using the $pull operator.
 * 5. Sets the consumedWaterPercentage to the new calculated percentage.
 * 6. Sets the option to return the updated document.
 * 7. Awaits the completion of the update operation.
 * 8. Returns the updated water record object, reflecting the removal of the water intake.
 *
 * This operation ensures that the user's daily water consumption record is accurately adjusted after the removal of an intake entry.
 */

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

/**
 * Service for retrieving a user's water records for a specified month.
 *
 * @param {string} userId - The unique identifier of the user whose records are being retrieved.
 * @param {string} startDate - The start date of the period for which records are requested.
 * @param {string} endDate - The end date of the period for which records are requested.
 * @returns {Array} An array of water record objects within the specified date range.
 *
 * This function performs the following actions:
 * 1. Constructs a query to find water records for the user that fall within the specified date range.
 * 2. Specifies which fields to include in the returned documents, excluding the document identifier (_id).
 * 3. Sorts the results in ascending order by the entry date.
 * 4. Converts the returned documents to JavaScript objects using the `lean` method for efficient processing.
 * 5. Returns an array of water record objects.
 *
 * This service is useful for generating reports or visualizations of a user's water intake over a month.
 */
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
