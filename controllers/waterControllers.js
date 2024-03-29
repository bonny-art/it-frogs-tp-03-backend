// import HttpError from "../helpers/HttpError.js";

export const createWaterRecord = async (req, res, next) => {
  try {
    res.send("Water record was created.");
  } catch (error) {
    next(error);
  }
};

export const updateWaterRecord = async (req, res, next) => {
  try {
    res.send("Water record was updated.");
  } catch (error) {
    next(error);
  }
};

export const deleteWaterRecord = async (req, res, next) => {
  try {
    res.send("Water record was deleted.");
  } catch (error) {
    next(error);
  }
};
