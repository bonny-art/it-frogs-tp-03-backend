import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { User } from "../db/models/User.js";

/**
 * Service for retrieving a user by their unique identifier.
 *
 * @param {string} id - The unique identifier of the user to be retrieved.
 * @returns {Object} The user object corresponding to the provided ID.
 *
 * This function performs the following action:
 * 1. Calls the `findById` method on the User model, passing the unique identifier as an argument.
 * 2. Awaits the database response and retrieves the user document.
 * 3. Returns the user object if found.
 *
 * If the user with the given ID does not exist, the function will return null.
 */

export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/**
 * Service for retrieving a user based on a specific query property.
 *
 * @param {Object} query - The query object containing the property to search for in the user document.
 * @returns {Object} The user object that matches the query criteria.
 *
 * This function performs the following action:
 * 1. Calls the `findOne` method on the User model, passing the query object as an argument.
 * 2. Awaits the database response and retrieves the user document that matches the query criteria.
 * 3. Returns the user object if a match is found.
 *
 * If no user matches the query criteria, the function will return null.
 */

export const getUserByProperty = async (query) => {
  const user = await User.findOne(query);

  return user;
};

/**
 * Service for creating a JSON Web Token (JWT) for a user.
 *
 * @param {string} id - The unique identifier of the user for whom the token is being created.
 * @returns {string} A JWT string that represents the user's session token.
 *
 * This function performs the following actions:
 * 1. Creates a payload object containing the user's unique identifier.
 * 2. Retrieves the secret key from the environment variables.
 * 3. Sets the token's lifespan to 7 days.
 * 4. Signs the token using the payload, secret key, and lifespan.
 * 5. Returns the signed JWT.
 *
 * The returned token can be used to authenticate the user in subsequent requests.
 */

const createToken = async (id) => {
  const payload = { id };
  const { SECRET_KEY } = process.env;
  const lifeLength = { expiresIn: "7d" };
  const token = jwt.sign(payload, SECRET_KEY, lifeLength);

  return token;
};

/**
 * Service for hashing a password.
 *
 * @param {string} password - The plaintext password to be hashed.
 * @returns {string} The hashed password.
 *
 * This function performs the following action:
 * 1. Calls the `hash` method from the bcryptjs library, passing the plaintext password and a salt round of 10.
 * 2. Awaits the completion of the hashing process.
 * 3. Returns the hashed password.
 *
 * The returned hashed password is then stored in the database for security purposes.
 */

export const hashPassword = async (password) => {
  const hashedPassword = await bcryptjs.hash(password, 10);

  return hashedPassword;
};

/**
 * Service for creating a new user in the database.
 *
 * @param {Object} param0 - An object containing the new user's email, plaintext password, name, avatar URL, and verification token.
 * @returns {Object} The newly created user object.
 *
 * This function performs the following actions:
 * 1. Hashes the plaintext password using the `hashPassword` service.
 * 2. Creates a new instance of the User model with the provided email, hashed password, name, avatar URL, and verification token.
 * 3. Saves the new user instance to the database.
 * 4. Returns the newly created user object.
 *
 * The returned user object includes all the information necessary for the user's profile, including authentication and verification details.
 */

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

/**
 * Service for verifying if a provided password matches the hashed password.
 *
 * @param {string} password - The plaintext password provided for verification.
 * @param {string} hashedPassword - The stored hashed password to compare against.
 * @returns {boolean} A boolean value indicating whether the password is valid.
 *
 * This function performs the following action:
 * 1. Calls the `compare` method from the bcryptjs library, passing the plaintext password and the hashed password.
 * 2. Awaits the result of the comparison.
 * 3. Returns true if the passwords match, otherwise false.
 *
 * This verification is crucial for authentication processes where password integrity must be maintained.
 */

export const isPasswordValid = async (password, hashedPassword) => {
  const isValid = await bcryptjs.compare(password, hashedPassword);
  return isValid;
};

/**
 * Service for logging in a user and updating their session token.
 *
 * @param {Object} user - The user object containing the user's ID.
 * @returns {Object} The updated user object with the new session token.
 *
 * This function performs the following actions:
 * 1. Generates a new session token for the user by calling the `createToken` service with the user's ID.
 * 2. Updates the user's document in the database with the new token by calling the `findByIdAndUpdate` method on the User model.
 * 3. Returns the updated user object, which now includes the new session token.
 *
 * The new session token is used for authenticating the user in subsequent requests.
 */

export const loginUser = async (user) => {
  const token = await createToken(user._id);

  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    {
      token,
      isPasswordVerified: false,
    },
    { new: true }
  );

  return loggedInUser;
};

/**
 * Service for logging out a user by clearing their session token.
 *
 * @param {string} userId - The unique identifier of the user to be logged out.
 * @returns {string} An empty string, indicating the user has been successfully logged out.
 *
 * This function performs the following action:
 * 1. Calls the `findByIdAndUpdate` method on the User model, passing the user's ID and setting the token to null.
 * 2. Awaits the database to update the user's document.
 * 3. Returns an empty string as a confirmation of the logout operation.
 *
 * This process effectively ends the user's session by removing their authentication token.
 */

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { token: null }, { new: true });

  return "";
};

/**
 * Service for updating a user's information in the database.
 *
 * @param {string} userId - The unique identifier of the user to be updated.
 * @param {Object} newUserInfo - An object containing the new information to update the user with.
 * @returns {Object} The updated user object.
 *
 * This function performs the following actions:
 * 1. Calls the `findByIdAndUpdate` method on the User model, passing the user's ID and the new information object.
 * 2. Sets the options to return the new updated object and to run schema validators on the update operation.
 * 3. Awaits the completion of the update operation.
 * 4. Returns the updated user object.
 *
 * The returned user object includes the latest information as per the new updates made to the user's document.
 */

export const updateUser = async (userId, newUserInfo) => {
  const updatedUser = await User.findByIdAndUpdate(userId, newUserInfo, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

/**
 * Service for deleting a user from the database.
 *
 * @param {string} userId - The unique identifier of the user to be deleted.
 * @returns {Object} The deleted user object.
 *
 * This function performs the following action:
 * 1. Calls the `findByIdAndDelete` method on the User model, passing the user's ID.
 * 2. Awaits the database to remove the user's document.
 * 3. Returns the deleted user object.
 *
 * This operation permanently removes the user's document from the database.
 */

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  return user;
};
