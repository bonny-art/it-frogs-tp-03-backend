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

export const createUser = async ({
  email,
  password,
  name,
  avatarURL,
  verificationToken,
}) => {
  const hashedPassword = await bcryptjs.hash(password, 10);

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

export const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  return user;
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  user.verificationToken = uuidv4();

  return user.save();
};

export const changeUserPassword = async (changePasswordToken, newPassword) => {
  if (!changePasswordToken || !newPassword) {
    throw HttpError(400, "Bad request");
  }
  const user = await User.findOne({ verificationToken: changePasswordToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  user.password = newPassword;
  user.verificationToken = null;

  await user.save();

  return user;
};

export const isValidChangePasswordToken = async (changePasswordToken) => {
  const user = await User.findOne({ changePasswordToken });

  if (user) {
    return true;
  } else {
    return false;
  }
};
