import express from "express";

import validateBody from "../helpers/validateBody.js";

import { auth } from "../middlewares/authMiddleware.js";

import {
  changePasswordUserSchema,
  createUserSchema,
  loginUserSchema,
  sendEmailUserSchema,
} from "../schemas/authSchemas.js";

import {
  createUser,
  loginUser,
  logoutUser,
  reVerificateUser,
  verificateUser,
  recoverPassword,
  sendPasswordRecoveryEmail,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), createUser);

authRouter.get("/verify/:verificationToken", verificateUser);

authRouter.post("/verify", validateBody(sendEmailUserSchema), reVerificateUser);

authRouter.post("/login", validateBody(loginUserSchema), loginUser);

authRouter.post("/logout", auth, logoutUser);

authRouter.post(
  "/recover-password",
  validateBody(sendEmailUserSchema),
  sendPasswordRecoveryEmail
);

authRouter.get(
  "/recover-password/:passwordRecoveryToken",
  validateBody(changePasswordUserSchema),
  recoverPassword
);

export default authRouter;
