import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    gender: {
      type: String,
      enum: ["woman", "man"],
      default: "woman",
    },
    dailyWaterGoal: {
      type: Number,
      default: 2000,
      max: [15000, "Water rate must not exceed 15 liters"],
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
  }
);

export const User = model("user", userSchema);
