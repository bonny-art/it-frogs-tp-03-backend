import express from "express";

import validateBody from "../helpers/validateBody.js";

import { updateWaterRateSchema } from "../schemas/waterRateSchemas.js";
import { updateWaterRate } from "../controllers/waterRateControllers.js";

const waterRateRouter = express.Router();

waterRateRouter.patch(
  "/",
  validateBody(updateWaterRateSchema),
  updateWaterRate
);

export default waterRateRouter;
