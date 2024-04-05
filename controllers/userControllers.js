import fs from "fs/promises";
import path from "path";

import { v2 as cloudinary } from "cloudinary";

import gravatar from "gravatar";
import crypto from "node:crypto";

import HttpError from "../helpers/HttpError.js";
import * as usersServ from "../services/userServices.js";
// import { resizeImage } from "../services/imageServices.js";

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Select an avatar file to upload");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      transformation: [
        { width: 80, height: 80, crop: "fill", gravity: "auto", radius: "max" },
      ],
      format: "png",
    });

    const avatarURL = result.url;

    fs.unlink(req.file.path);

    await usersServ.updateUser(req.user.id, {
      avatarURL,
    });

    res.send({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await usersServ.getUserById(req.user.id);
    const { email, name, gender, dailyWaterGoal, avatarURL } = currentUser;

    res.send({ email, name, gender, dailyWaterGoal, avatarURL });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Body must have at least one field");
    }

    const payload = req.body.basicInfo;

    const oldPassword = req.body.securityCredentials?.oldPassword;
    const newPassword = req.body.securityCredentials?.newPassword;

    if (oldPassword) {
      const { password } = await usersServ.getUserById(req.user._id);

      const isOldPasswordValid = await usersServ.isPasswordValid(
        oldPassword,
        password
      );

      if (!isOldPasswordValid) {
        throw HttpError(
          401,
          "Your old password is incorrect. Please try again"
        );
      }

      const hashedPassword = await usersServ.hashPassword(newPassword);

      payload.password = hashedPassword;
    }

    const newUser = await usersServ.updateUser(req.user.id, payload);

    const { email, name, gender, dailyWaterGoal, avatarURL } = newUser;

    res.send({ email, name, gender, dailyWaterGoal, avatarURL });
  } catch (error) {
    next(error);
  }
};
