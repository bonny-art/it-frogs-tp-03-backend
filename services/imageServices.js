import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

export const resizeImage = async (imagePath, width, heights) => {
  await Jimp.read(imagePath)
    .then((image) => {
      return image.resize(width, heights).writeAsync(imagePath);
    })
    .catch((error) => {
      throw HttpError(500, `Error resizing an image: ${error}`);
    });
};
