import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { User } from "../db/models/User.js";

export const isUserExistant = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const createToken = async (id) => {
  const payload = { id };
  const { SECRET_KEY } = process.env;
  const lifeLength = { expiresIn: "7d" };
  const token = jwt.sign(payload, SECRET_KEY, lifeLength);

  return token;
};

export const createUser = async ({ email, password }) => {
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = new User({ email, password: hashedPassword });
  await user.save();

  return user;
};

export const isPasswordValid = async (password, hashedPassword) => {
  const isValid = await bcryptjs.compare(password, hashedPassword);
  return isValid;
};

export const loginUser = async (user) => {
  const token = await createToken(user._id);

  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

  return loggedInUser;
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { token: null }, { new: true });

  return "";
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

export const updateUser = async (userId, newUserInfo) => {
  const updatedUser = await User.findByIdAndUpdate(userId, newUserInfo, {
    new: true,
  });
  return updatedUser;
};
