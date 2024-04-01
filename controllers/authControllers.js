import gravatar from "gravatar";
import crypto from "node:crypto";

import HttpError from "../helpers/HttpError.js";
import * as usersServ from "../services/userServices.js";

import { sendMail } from "../services/sendMailServices.js";

export const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const name = normalizedEmail.split("@")[0];
    const user = await usersServ.isUserExistant(normalizedEmail);
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email);

    const verificationToken = crypto.randomUUID();

    const newUser = await usersServ.createUser({
      ...req.body,
      email: normalizedEmail,
      name,
      avatarURL,
      verificationToken,
    });

    sendMail(req, newUser);

    res.status(201).send({
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verificateUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await usersServ.verifyUser(verificationToken);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await usersServ.updateUser(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const reVerificateUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw HttpError(400, "Missing required field email");
    }

    const user = await usersServ.isUserExistant(email);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify === true) {
      throw HttpError(400, "Verification has already been passed");
    }

    // sendMail(req, user);

    res.send({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await usersServ.isUserExistant(normalizedEmail);

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await usersServ.isPasswordValid(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (user.verify === false) {
      throw HttpError(401, "Your email is not verified");
    }

    const loggedInUser = await usersServ.loginUser(user);

    res.send({
      token: loggedInUser.token,
      user: {
        email: loggedInUser.email,
        name: loggedInUser.name,
        dailyWaterGoal: loggedInUser.dailyWaterGoal,
        avatarURL: loggedInUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await usersServ.logoutUser(req.user.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await usersServ.forgotPassword(email);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    const changePasswordToken = crypto.randomUUID();

    await user.updateOne({ changePasswordToken });

    delete user.verificationToken;

    const resetPasswordUrl = `http://localhost:8080/api/auth/recover-password?token=${changePasswordToken}`;

    sendMail({
      to: email,
      subject: "Reset Password Instructions",
      text: `To reset your password, please click on the following link: ${resetPasswordUrl}`,
    });

    res.status(200).json({
      message:
        "Password reset instructions have been sent to your email. Please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { changePasswordToken } = req.params;
    const { newPassword } = req.body;

    const isValidToken = await usersServ.isValidChangePasswordToken(
      changePasswordToken
    );

    if (!isValidToken) {
      throw HttpError(404, "Invalid or expired token");
    }

    const user = await usersServ.changeUserPassword(
      changePasswordToken,
      newPassword
    );

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};
