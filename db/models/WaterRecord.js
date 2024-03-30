import { Schema, model } from "mongoose";

const waterRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    entryDate: {
      type: Date,
      required: true,
    },
    dailyWaterGoal: {
      type: Number,
      default: 2000,
      max: [15000, "Water rate must not exceed 15 liters"],
    },
    consumedWater: {
      type: Number,
      default: 0,
    },
    consumedTimes: {
      type: Number,
      default: 0,
      min: [0, "Percentage of water cannot be negative"],
    },
    consumedWaterPercentage: {
      type: Number,
      default: 0,
      min: [0, "Number of water intakes cannot be negative"],
    },
    waterIntakes: [
      {
        ml: {
          type: Number,
          required: true,
          min: [0, "Amount of water cannot be negative"],
          max: [5000, "Amount of water cannot exceed 5 liters"],
        },
        consumedAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

export const WaterRecord = model("WaterRecord", waterRecordSchema);
