import express from "express";

import authRoutes from "./authRouter.js";
import usersRoutes from "./usersRouter.js";
import waterRoutes from "./waterRouter.js";

import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", auth, usersRoutes);
router.use("/water", auth, waterRoutes);

export default router;
