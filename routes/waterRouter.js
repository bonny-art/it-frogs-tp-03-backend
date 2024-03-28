import express from "express";

import validateBody from "../helpers/validateBody.js";
import validateID from "../helpers/validateID.js";

import validateBody from "../helpers/validateBody.js";

import validateID from "../helpers/validateID.js";
import {
  createWaterRecSchema,
  updateWaterRecSchema,
} from "../schemas/waterSchemas.js";

const waterRouter = express.Router();

waterRouter.post("/", validateBody(createWaterRecSchema), createWaterRecord);

waterRouter.put(
  "/:waterRecordId",
  validateID,
  validateBody(updateWaterRecSchema),
  updateWaterRecord
);

waterRouter.delete("/:waterRecordId", validateID, deleteWaterRecord);

waterRouter.get("/today", getTodayWaterRecords);

waterRouter.get("/monthly", getMonthlyWaterRecords);

export default waterRouter;
