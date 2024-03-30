import Joi from "joi";

export const waterRecSchema = Joi.object({
  data: Joi.date().required(),
  ml: Joi.number().required(),
});
