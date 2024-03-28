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

export const updateUserSchema = Joi.object({
  // subscription: Joi.string()
  //   .valid("starter", "pro", "business")
  //   .default("starter"),
});
