import Joi from "joi";

export const updateUserSchema = Joi.object({
  basicInfo: Joi.object({
    name: Joi.string().optional(),
    gender: Joi.string().valid("woman", "man").optional(),
    email: Joi.string().email().optional(),
  }).optional(),
  securityCredentials: Joi.object({
    oldPassword: Joi.string().optional(),
    newPassword: Joi.string().optional(),
  }).optional(),
}).with("securityCredentials.oldPassword", "securityCredentials.newPassword");

export const validatePasswordSchema = Joi.object({
  password: Joi.string().required(),
});
