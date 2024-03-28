import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { getUserById } from "../services/userServices.js";

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

    req.user = {
      id: reqUserId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
