import Joi from "joi";

export const waterRecSchema = Joi.object({
  date: Joi.date().required(),
  timeZoneOffset: Joi.number().required(),
  ml: Joi.number().required(),
});

export const waterDeleteSchema = Joi.object({
  date: Joi.date().required(),
  timeZoneOffset: Joi.number().required(),
});
