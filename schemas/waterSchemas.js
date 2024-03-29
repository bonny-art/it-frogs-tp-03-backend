import Joi from "joi";

export const createWaterRecSchema = Joi.object({
  // name: Joi.string().required(),
  // email: Joi.string().email().required(),
  // phone: Joi.string().required(),
});

export const updateWaterRecSchema = Joi.object({
  // name: Joi.string(),
  // email: Joi.string().email(),
  // phone: Joi.string(),
  // favorite: Joi.boolean(),
});


export const waterSchema = Joi.object({
  entryDate: Joi.date().iso().required(),
  userId: Joi.string().alphanum().required()
});


