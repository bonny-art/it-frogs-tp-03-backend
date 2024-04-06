import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { User } from "../db/models/User.js";

export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

export const getUserByProperty = async (query) => {
  const user = await User.findOne(query);

  return user;
};

const createToken = async (id) => {
  const payload = { id };
  const { SECRET_KEY } = process.env;
  const lifeLength = { expiresIn: "7d" };
  const token = jwt.sign(payload, SECRET_KEY, lifeLength);

  return token;
};

export const hashPassword = async (password) => {
  const hashedPassword = await bcryptjs.hash(password, 10);

  return hashedPassword;
};

export const createUser = async ({
  email,
  password,
  name,
  avatarURL,
  verificationToken,
}) => {
  const hashedPassword = await hashPassword(password);

  const user = new User({
    email,
    password: hashedPassword,
    name,
    avatarURL,
    verificationToken,
  });
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

export const updateUser = async (userId, newUserInfo) => {
  const updatedUser = await User.findByIdAndUpdate(userId, newUserInfo, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  return user;
};
