import express from "express";

import { getMonthWaterRecords } from "../controllers/monthControllers.js";

const waterRouter = express.Router();

waterRouter.get("/", getMonthWaterRecords);

export default waterRouter;
