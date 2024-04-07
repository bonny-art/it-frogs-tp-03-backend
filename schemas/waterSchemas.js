import Joi from "joi";

export const waterRecSchema = Joi.object({
  date: Joi.date().required(),
  ml: Joi.number().required(),
  timeZoneOffset: Joi.number().required(),
});
