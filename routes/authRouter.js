import express from "express";

import validateBody from "../helpers/validateBody.js";

import { auth } from "../middlewares/authMiddleware.js";

import {
  createUserSchema,
  loginUserSchema,
  reVerificateUserSchema,
} from "../schemas/authSchemas.js";

import {
  createUser,
  loginUser,
  logoutUser,
  reVerificateUser,
  verificateUser,
} from "../controllers/authControllers.js";

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
