import fs from "fs/promises";
import path from "path";

import { v2 as cloudinary } from "cloudinary";

import HttpError from "../helpers/HttpError.js";
import * as usersServ from "../services/userServices.js";
import * as waterServices from "../services/waterServices.js";

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

/**
 * Controller for uploading a user's avatar.
 *
 * @param {Object} req - The request object containing the file to be uploaded.
 * @param {Object} res - The response object used to send back the URL of the uploaded avatar.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Checks if a file is included in the request; if not, throws a 400 HTTP error.
 * 2. Uploads the file to Cloudinary with specified transformations and format settings.
 * 3. Retrieves the URL of the uploaded image from the Cloudinary response.
 * 4. Deletes the local file from the server using the filesystem module.
 * 5. Updates the user's profile in the database with the new avatar URL.
 * 6. Sends a response with the avatar URL.
 *
 * If any errors occur, such as file upload issues or database update problems,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Select an avatar file to upload");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      transformation: [
        {
          width: 160,
          height: 160,
          crop: "fill",
          gravity: "auto",
          radius: "max",
        },
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

/**
 * Retrieves the current user's information from the request object.
 *
 * @param {Request} req - The Express request object containing the authenticated user's data.
 * @param {Response} res - The Express response object used to send back the user's data.
 * @param {Function} next - The callback function to pass control to the next handler in case of an error.
 *
 * This function extracts the user's email, name, gender, daily water intake goal, and avatar URL from the request object.
 * It then sends this information back to the client in the response body.
 *
 * @throws {Error} If an error occurs during the process, it is passed to the next error handler.
 */

export const getCurrentUser = async (req, res, next) => {
  try {
    const { _id, email, name, gender, dailyWaterGoal, avatarURL } = req.user;

    res.send({ _id, email, name, gender, dailyWaterGoal, avatarURL });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates user information in the database.
 *
 * @param {Request} req - The Express request object containing user data to update.
 * @param {Response} res - The Express response object used to send back the updated user data.
 * @param {Function} next - The callback function to pass control to the next handler in case of an error.
 *
 * This function first checks if the request body contains at least one field to update.
 * If so, it creates a new object with the user's basic information.
 * In case the user attempts to change their password, the function verifies the old password,
 * and if it's correct, updates it to a new, hashed password.
 * After successfully updating the user information, the function sends the updated data back to the client.
 *
 * @throws {HttpError} When the request body is empty or the old password is incorrect.
 */

export const updateUser = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Body must have at least one field");
    }

    const payload = { ...req.body.basicInfo };

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

    const updatedUser = await usersServ.updateUser(req.user.id, payload);

    const { email, name, gender, dailyWaterGoal, avatarURL } = updatedUser;

    res.send({ email, name, gender, dailyWaterGoal, avatarURL });
  } catch (error) {
    next(error);
  }
};

export const validatePassword = async (req, res, next) => {
  const userPassword = req.body.password;
  const query = { userId: req.user.id };

  try {
    const { password } = await usersServ.getUserById(req.user._id);

    const isUserPasswordValid = await usersServ.isPasswordValid(
      userPassword,
      password
    );

    if (!isUserPasswordValid) {
      throw HttpError(401, "You don`t have permissions to delete this account");
    }

    await usersServ.updateUser(req.user.id, {
      isPasswordVerified: true,
    });

    res.send({
      message: "Password is valid",
      isPasswordCorrect: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for deleting a user account.
 *
 * @param {Object} req - The request object containing the user's password.
 * @param {Object} res - The response object used to send back the deletion details.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Extracts the user's password from the request body.
 * 2. Constructs a query object using the user's ID from the request.
 * 3. Retrieves the user's hashed password from the database.
 * 4. Validates the provided password against the stored hash.
 * 5. If the password is invalid, throws a 401 HTTP error indicating lack of permissions.
 * 6. Deletes the user's account from the database.
 * 7. Deletes the user's associated water consumption records.
 * 8. Sends a response with the user's email, name, and the count of deleted records.
 *
 * If any errors occur, such as an invalid password or database issues,
 * an appropriate HTTP error is thrown and handled by the next middleware function.
 */

export const deleteUser = async (req, res, next) => {
  const { _id, isPasswordVerified } = req.user;

  const query = { userId: _id };

  try {
    if (!isPasswordVerified) {
      throw HttpError(401, "You don`t have permissions to delete this account");
    }

    const user = await usersServ.deleteUser(_id);

    const result = await waterServices.deleteWaterRecords(query);

    const { email, name } = user;

    res.send({
      email,
      name,
      recordsDeleted: result.deletedCount,
      isDeleted: true,
    });
    // res.send({ isDeleted: true });
  } catch (error) {
    next(error);
  }
};
