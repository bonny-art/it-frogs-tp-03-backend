import express from "express";

import validateBody from "../helpers/validateBody.js";
import validateID from "../helpers/validateID.js";

import validateBody from "../helpers/validateBody.js";

import validateID from "../helpers/validateID.js";

const waterIntakesRouter = express.Router();

waterIntakesRouter.post(
  "/",
  validateBody(createWaterIntakeSchema),
  createWaterIntake
);

waterIntakesRouter.put(
  "/:waterIntakeId",
  validateID,
  validateBody(updateWaterIntakeSchema),
  updateWaterIntake
);

waterIntakesRouter.delete(
  "/:waterIntakeId",
  validateID,

  deleteWaterIntake
);

waterIntakesRouter.get("/today", getTodayWaterIntakes);

waterIntakesRouter.get("/monthly", getMonthlyWaterIntakes);

export default waterIntakesRouter;
