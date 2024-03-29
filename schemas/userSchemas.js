import Joi from "joi";

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  gender: Joi.string().valid("woman", "man"),
});
