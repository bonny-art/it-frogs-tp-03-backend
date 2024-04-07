import gravatar from "gravatar";
import crypto from "node:crypto";

import HttpError from "../helpers/HttpError.js";
import * as usersServ from "../services/userServices.js";

// import { sendMail } from "../services/sendMailServices.js";
import * as makeLetterHTML from "../helpers/makeLetterHTML.js";

/**
 * This controller handles the creation of a new user.
 *
 * @param {Object} req - The request object containing the user's input data.
 * @param {Object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * The function performs the following steps:
 * 1. Extracts the email from the request body and normalizes it to lowercase.
 * 2. Derives a username from the normalized email by splitting at the "@" symbol.
 * 3. Checks if a user with the given email already exists in the database to prevent duplicates.
 * 4. Generates a unique avatar URL using the Gravatar service based on the user's email.
 * 5. Creates a new verification token using the crypto library.
 * 6. Creates a new user record in the database with the provided details and generated values.
 * 7. Prepares an HTML content for the email verification letter.
 * 8. Sends an email to the new user with a subject line prompting them to confirm their registration.
 * 9. Responds with a 201 status code and the new user's email if the process is successful.
 *
 * If any errors occur during the process, the error is passed to the next middleware function.
 */

export const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const name = normalizedEmail.split("@")[0];
    const user = await usersServ.getUserByProperty({ email: normalizedEmail });
    if (user) {
      throw HttpError(
        409,
        "Email already in use. Please try another or reset your password if this is your account."
      );
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

    const subject = "Confirm the registration on Tracker of water";
    const letter = makeLetterHTML.makeEmailVerificationLetterHTML(
      req,
      newUser,
      subject
    );

    // sendMail(letter);

    res.status(201).send({
      user: {
        email: newUser.email,

        ...letter,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * This controller handles the user email verification process.
 *
 * @param {Object} req - The request object containing the verification token.
 * @param {Object} res - The response object used to send back a success message.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * The function performs the following steps:
 * 1. Retrieves the verification token from the request parameters.
 * 2. Attempts to find a user in the database with the provided verification token.
 * 3. If no user is found, it throws a 404 error indicating the user was not found.
 * 4. If a user is found, it updates the user's record in the database to set the 'verify' field to true and clears the 'verificationToken' field.
 * 5. Sends a response back to the client confirming that the verification was successful.
 *
 * If an error occurs during the process, it is caught and passed to the next middleware function with the 'next' call.
 */

export const verificateUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  console.log("🚀 ~ verificationToken:", verificationToken);

  try {
    const user = await usersServ.getUserByProperty({ verificationToken });
    console.log("🚀 ~ user:", user);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await usersServ.updateUser(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for resending a verification email to a user.
 *
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object used to send back a success message.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Validates that the email field is present in the request body.
 * 2. Retrieves the user from the database based on the provided email.
 * 3. Checks if the user exists and if they have not already been verified.
 * 4. Generates an HTML content for the verification email using a helper function.
 * 5. Sends the verification email to the user with a subject line prompting them to confirm their registration.
 * 6. Responds with a message indicating that the verification email has been sent.
 *
 * If any errors occur, such as missing email, user not found, or user already verified,
 * an appropriate HTTP error is thrown and handled by the next middleware function.
 */

export const reVerificateUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw HttpError(400, "Missing required field email");
    }

    const user = await usersServ.getUserByProperty({ email });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify === true) {
      throw HttpError(400, "Verification has already been passed");
    }

    const subject = "Action Required: Verify Your Water Tracker Account";
    const letter = makeLetterHTML.makeEmailVerificationLetterHTML(
      req,
      user,
      subject
    );
    console.log("🚀 ~ letter:", letter);

    // sendMail(letter);

    res.send({
      message: `Verification email sent.`,
      ...letter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for authenticating a user and logging them in.
 *
 * @param {Object} req - The request object containing the user's credentials.
 * @param {Object} res - The response object used to send back the authentication token and user details.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Extracts the email and password from the request body.
 * 2. Normalizes the email to lowercase to ensure consistency.
 * 3. Retrieves the user from the database based on the normalized email.
 * 4. Validates the existence of the user and the correctness of the password.
 * 5. Checks if the user's email has been verified.
 * 6. Logs the user in and generates an authentication token.
 * 7. Sends a response with the token and user details such as email, name, daily water goal, and avatar URL.
 *
 * If any errors occur, such as incorrect credentials or unverified email,
 * an appropriate HTTP error is thrown and handled by the next middleware function.
 */

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await usersServ.getUserByProperty({ email: normalizedEmail });

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
        gender: loggedInUser.gender,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for logging out a user.
 *
 * @param {Object} req - The request object containing the user's information.
 * @param {Object} res - The response object used to end the session.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Calls the logoutUser service function with the current user's ID.
 * 2. Awaits the completion of the logout process.
 * 3. Sends a 204 No Content status, indicating successful logout without any content to return.
 *
 * If an error occurs during the logout process, it is caught and passed to the next middleware function for error handling.
 */

export const logoutUser = async (req, res, next) => {
  try {
    await usersServ.logoutUser(req.user.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for sending a password recovery email to a user.
 *
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object used to send a confirmation message.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Extracts the email from the request body and normalizes it to lowercase.
 * 2. Retrieves the user from the database using the normalized email.
 * 3. If the user does not exist, throws a 404 HTTP error.
 * 4. Generates a unique password recovery token using the crypto module.
 * 5. Updates the user's document in the database with the new token.
 * 6. Creates an HTML content for the password recovery email.
 * 7. Sends the email with the token to the user's email address.
 * 8. Responds with a 200 status code and a message indicating that password reset instructions have been sent.
 *
 * If any errors occur during the process, such as a failure to send the email,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const sendPasswordRecoveryEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await usersServ.getUserByProperty({ email: normalizedEmail });

    if (!user) {
      throw HttpError(404, "Ther is no user with this email address");
    }

    const passwordRecoveryToken = crypto.randomUUID();

    const newUser = await usersServ.updateUser(user._id, {
      passwordRecoveryToken,
    });

    const subject = "Your Account Password Reset Request";
    const letter = makeLetterHTML.makePasswordRecoveryLetterHTML(
      req,
      newUser,
      subject
    );

    // sendMail(letter);

    res.json({
      message:
        "Password reset instructions have been sent to your email. Please check your inbox.",
      letter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for recovering a user's password.
 *
 * @param {Object} req - The request object containing the password recovery token and new password.
 * @param {Object} res - The response object used to send a success message.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Extracts the password recovery token from the request parameters.
 * 2. Extracts the new password from the request body.
 * 3. Retrieves the user associated with the password recovery token from the database.
 * 4. If the user is not found, throws a 404 HTTP error.
 * 5. Hashes the new password using the users service.
 * 6. Updates the user's document in the database to set the new hashed password and remove the password recovery token.
 * 7. Sends a 200 status response with a message indicating successful password change.
 *
 * If any errors occur, such as database connection issues or hashing failures,
 * the error is caught and passed to the next middleware function for error handling.
 */

export const recoverPassword = async (req, res, next) => {
  try {
    const { passwordRecoveryToken } = req.params;
    const { password } = req.body;

    const user = await usersServ.getUserByProperty({ passwordRecoveryToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    const hashedPassword = await usersServ.hashPassword(password);

    await usersServ.updateUser(user._id, {
      passwordRecoveryToken: null,
      password: hashedPassword,
    });

    res.status(200).send({
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
