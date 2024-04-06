import express from "express";
import upload from "../services/uploadServices.js";

import validateBody from "../helpers/validateBody.js";

import { deleteUserSchema, updateUserSchema } from "../schemas/userSchemas.js";

import {
  uploadAvatar,
  getCurrentUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.patch("/avatars", upload.single("avatar"), uploadAvatar);

userRouter.get("/current", getCurrentUser);

userRouter.patch("/", validateBody(updateUserSchema), updateUser);

userRouter.delete("/", validateBody(deleteUserSchema), deleteUser);

export default userRouter;
