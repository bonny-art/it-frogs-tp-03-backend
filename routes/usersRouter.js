import express from "express";

import validateBody from "../helpers/validateBody.js";

import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../schemas/usersSchemas.js";

import {
  getCurrentUser,
  updateUser,
  uploadAvatar,
} from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.patch("/avatars", upload.single("avatar"), uploadAvatar);

usersRouter.get("/current", getCurrentUser);

usersRouter.patch("/", validateBody(updateUserSchema), updateUser);

usersRouter.patch(
  "/daily-water-goal",
  validateBody(updateWaterRateSchema),
  updateUser
);

export default usersRouter;
