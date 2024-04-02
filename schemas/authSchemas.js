import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const sendEmailUserSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordUserSchema = Joi.object({
  password: Joi.string().required(),
});
