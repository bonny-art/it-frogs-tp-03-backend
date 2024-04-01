import express from "express";
import validateBody from "../helpers/validateBody.js";
import { getMonthWaterRecords } from "../controllers/monthControllers.js";
import { updateWaterRateSchema } from "../schemas/waterRateSchemas.js";

const waterRouter = express.Router();

waterRouter.get("/", getMonthWaterRecords);

export default waterRouter;
