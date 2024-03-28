import Joi from "joi";

export const createWaterIntakeSchema = Joi.object({
  // name: Joi.string().required(),
  // email: Joi.string().email().required(),
  // phone: Joi.string().required(),
});

export const updateWaterIntakeSchema = Joi.object({
  // name: Joi.string(),
  // email: Joi.string().email(),
  // phone: Joi.string(),
  // favorite: Joi.boolean(),
});
