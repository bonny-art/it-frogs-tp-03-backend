import HttpError from "../helpers/HttpError.js";

import * as usersServ from "../services/userServices.js";

export const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await usersServ.isUserExistant(normalizedEmail);
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const newUser = await usersServ.createUser({
      ...req.body,
      email: normalizedEmail,
    });
    res.status(201).send({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
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

    const loggedInUser = await usersServ.loginUser(user);

    res.status(200).send({
      token: loggedInUser.token,
      user: {
        email: loggedInUser.email,
        subscription: loggedInUser.subscription,
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

export const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await usersServ.getCurrentUser(req.user.id);
    const { email, subscription } = currentUser;

    res.status(200).send({ email, subscription });
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

    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};
