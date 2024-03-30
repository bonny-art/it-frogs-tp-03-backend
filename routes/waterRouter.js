import express from "express";

import validateBody from "../helpers/validateBody.js";
import validateID from "../helpers/validateID.js";

import { waterRecSchema } from "../schemas/waterSchemas.js";
import {
  createWaterIntakeRecord,
  deleteWaterIntakeRecord,
  updateWaterIntakeRecord,
} from "../controllers/waterControllers.js";

const waterRouter = express.Router();

waterRouter.post("/", validateBody(waterRecSchema), createWaterIntakeRecord);

waterRouter.put(
  "/:waterRecordId",
  validateID,
  validateBody(waterRecSchema),
  updateWaterIntakeRecord
);

waterRouter.delete("/:waterRecordId", validateID, deleteWaterIntakeRecord);

export default waterRouter;
