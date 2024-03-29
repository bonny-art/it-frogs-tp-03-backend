import express from "express";

import validateBody from "../helpers/validateBody.js";
import validateID from "../helpers/validateID.js";

import { waterRecSchema } from "../schemas/waterSchemas.js";
import {
  createWaterRecord,
  deleteWaterRecord,
  updateWaterRecord,
} from "../controllers/waterControllers.js";

const waterRouter = express.Router();

waterRouter.post("/", validateBody(waterRecSchema), createWaterRecord);

waterRouter.put(
  "/:waterRecordId",
  validateID,
  validateBody(waterRecSchema),
  updateWaterRecord
);

waterRouter.delete("/:waterRecordId", validateID, deleteWaterRecord);

export default waterRouter;
