import express from "express";

import usersRoutes from "./usersRouter.js";
import waterIntakesRoutes from "./waterIntakesRouter.js";

import { auth } from "../services/authServices.js";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/water-intakes", auth, waterIntakesRoutes);

export default router;
