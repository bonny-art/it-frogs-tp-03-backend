import express from "express";
import validateBody from "../helpers/validateBody.js";
import { getMonthWater } from "../controllers/monthControllers.js";
import { updateWaterRateSchema } from "../schemas/waterRateSchemas.js";


const waterRouter = express.Router();

waterRouter.get("/", validateBody(updateWaterRateSchema), getMonthWater);

export default waterRouter;
