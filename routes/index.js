import express from "express";

import apiDocsRoutes from "./apiDocsRoutes.js";
import authRoutes from "./authRouter.js";
import userRoutes from "./userRouter.js";
import waterRateRoutes from "./waterRateRouter.js";
import waterRoutes from "./waterRouter.js";
import todayRoutes from "./todayRouter.js";
import monthRoutes from "./monthRouter.js";

import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use("/apidocs", apiDocsRoutes);
router.use("/auth", authRoutes);
router.use("/user", auth, userRoutes);
router.use("/waterrate", auth, waterRateRoutes);
router.use("/water", auth, waterRoutes);
router.use("/today", auth, todayRoutes);
router.use("/month", auth, monthRoutes);

export default router;
