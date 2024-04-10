import express from "express";
import upload from "../services/uploadServices.js";

import validateBody from "../helpers/validateBody.js";

import {
  updateUserSchema,
  validatePasswordSchema,
} from "../schemas/userSchemas.js";

import {
  uploadAvatar,
  getCurrentUser,
  updateUser,
  deleteUser,
  validatePassword,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.patch("/avatars", upload.single("avatar"), uploadAvatar);

userRouter.get("/current", getCurrentUser);

userRouter.patch("/", validateBody(updateUserSchema), updateUser);

userRouter.post(
  "/validate",
  validateBody(validatePasswordSchema),
  validatePassword
);

userRouter.delete("/", deleteUser);

export default userRouter;
