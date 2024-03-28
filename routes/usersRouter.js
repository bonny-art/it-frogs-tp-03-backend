import express from "express";

import validateBody from "../helpers/validateBody.js";

import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../schemas/usersSchemas.js";

import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
} from "../controllers/usersControllers.js";

import { auth } from "../services/authServices.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createUser);

usersRouter.get("/verify/:verificationToken", verificateUser);

usersRouter.post(
  "/verify",
  validateBody(reVerificateUserSchema),
  reVerificateUser
);

usersRouter.post("/login", validateBody(loginUserSchema), loginUser);

usersRouter.post("/logout", auth, logoutUser);

usersRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);

usersRouter.get("/current", auth, getCurrentUser);

usersRouter.patch("/", auth, validateBody(updateUserSchema), updateUser);

usersRouter.patch(
  "/daily-water-goal",
  auth,
  validateBody(updateWaterRateSchema),
  updateUser
);

export default usersRouter;
