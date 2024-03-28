import express from "express";

import validateBody from "../helpers/validateBody.js";

import { createUserSchema, loginUserSchema } from "../schemas/usersSchemas.js";

import {
  createUser,
  loginUser,
  logoutUser,
  reVerificateUser,
  verificateUser,
} from "../controllers/usersControllers.js";

import { auth } from "../services/authServices.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), createUser);

authRouter.get("/verify/:verificationToken", verificateUser);

authRouter.post(
  "/verify",
  validateBody(reVerificateUserSchema),
  reVerificateUser
);

authRouter.post("/login", validateBody(loginUserSchema), loginUser);

authRouter.post("/logout", auth, logoutUser);

export default authRouter;
