import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import crypto from "node:crypto";

import HttpError from "../helpers/HttpError.js";
import * as usersServ from "../services/userServices.js";
import { resizeImage } from "../services/imageServices.js";

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Select an avatar file to upload");
    }

    await resizeImage(req.file.path, 250, 250);

    fs.rename(
      req.file.path,
      path.join(process.cwd(), "public", "avatars", req.file.filename)
    );

    const avatarURL = path.join("avatars", req.file.filename);
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

    const newUser = await usersServ.updateUser(req.user.id, req.body);

    const { email, name, gender, dailyWaterGoal, avatarURL } = newUser;

    res.send({ email, name, gender, dailyWaterGoal, avatarURL });
  } catch (error) {
    next(error);
  }
};
