import Joi from "joi";

export const updateWaterRateSchema = Joi.object({
  dailyWaterGoal: Joi.number().required(),
});
