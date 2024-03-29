import express from "express";

import { getTodayWaterRecord } from "../controllers/todayControllers.js";

const todayRouter = express.Router();

todayRouter.get("/", getTodayWaterRecord);

export default todayRouter;
