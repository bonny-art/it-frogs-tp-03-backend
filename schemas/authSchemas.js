import Joi from "joi";

export const createUserSchema = Joi.object({
  // password: Joi.string().required(),
  // email: Joi.string().email().required(),
  // subscription: Joi.string()
  //   .valid("starter", "pro", "business")
  //   .default("starter"),
});

export const loginUserSchema = Joi.object({
  // password: Joi.string().required(),
  // email: Joi.string().email().required(),
});
