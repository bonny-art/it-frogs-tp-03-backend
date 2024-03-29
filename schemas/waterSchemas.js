import Joi from "joi";

export const waterRecSchema = Joi.object({
  date: Joi.string().required(),
  ml: Joi.number().required(),
});
