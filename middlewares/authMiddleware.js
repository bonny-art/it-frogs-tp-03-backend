import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { getUserById } from "../services/userServices.js";

/**
 * Middleware for authenticating a user based on the JWT token provided in the request headers.
 *
 * @param {Object} req - The request object containing the authorization header.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 *
 * This function performs the following actions:
 * 1. Retrieves the authorization header from the request.
 * 2. If the authorization header is not present, throws a 401 HTTP error indicating the user is not authorized.
 * 3. Splits the authorization header into the bearer keyword and the token.
 * 4. If the bearer keyword is not 'Bearer', throws a 401 HTTP error indicating the user is not authorized.
 * 5. Verifies the token using the secret key from the environment variables.
 * 6. If the token verification fails or is expired, throws a 401 HTTP error.
 * 7. Retrieves the user's ID from the decoded token.
 * 8. Fetches the user from the database using the user's ID.
 * 9. If the user is not found or the token does not match the user's token, throws a 401 HTTP error.
 * 10. Assigns the authenticated user to the request object.
 * 11. Passes control to the next middleware function.
 *
 * If any errors occur during the process, the error is caught and passed to the next middleware function for error handling.
 */

export const auth = async (req, res, next) => {
  const headerAuth = req.headers.authorization;

  try {
    if (!headerAuth) {
      throw HttpError(401, "Not authorized");
    }

    const [bearer, token] = headerAuth.split(" ", 2);

    if (bearer !== "Bearer") {
      throw HttpError(401, "Not authorized");
    }

    var reqUserId = "";
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw HttpError(401, "Token expired");
        }

        throw HttpError(401, "Not authorized");
      }
      reqUserId = decoded.id;
    });

    const user = await getUserById(reqUserId);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    if (token !== user.token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
