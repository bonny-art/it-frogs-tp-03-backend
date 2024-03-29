// import HttpError from "../helpers/HttpError.js";

export const updateWaterRate = async (req, res, next) => {
  try {
    res.send("Water rate was updated.");
  } catch (error) {
    next(error);
  }
};
