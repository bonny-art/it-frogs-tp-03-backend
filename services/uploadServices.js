import multer from "multer";
import * as path from "node:path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename(req, file, cb) {
    const fileExtention = path.extname(file.originalname);
    const fileBase = path.basename(file.originalname, fileExtention);
    const fileSuffix = crypto.randomUUID();
    const newFileName = `${fileBase}-${fileSuffix}${fileExtention}`;

    cb(null, newFileName);
  },
});

export default multer({ storage });
