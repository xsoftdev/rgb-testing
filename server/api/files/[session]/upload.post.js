import multer from "multer";
import fs from "fs";
import path from "path";
import dirname from "dirname";
import { PDFDocument } from "pdf-lib";
import jwt from "jsonwebtoken";
import File from "../models/file.model";
import User from '../../users/models/user.model'
const filePath = dirname() + "../../public/uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(filePath));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let filename = file.originalname;
    let fileDestination = path.join(filePath, filename);

    let counter = 0;
    while (fs.existsSync(fileDestination)) {
      counter++;
      filename = `${
        path.parse(file.originalname).name
      }_${counter}${path.extname(file.originalname)}`;
      fileDestination = path.join(filePath, filename);
    }
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export default defineEventHandler(async (event) => {
  try {
    const session = getRouterParam(event, "session");
    const decoded = jwt.decode(session);

    const uploadPromise = new Promise((resolve, reject) => {
      upload.single("file")(event.req, event.res, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve((res) => {
            console.log(res);
          });
        }
      });
    });

    await uploadPromise;

    const pdfPath = path.join(filePath, event.req.file.filename);

    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));
    const pageCount = pdfDoc.getPageCount();
    const fileSizeBytes = fs.statSync(pdfPath).size;
    const fileFormat = path.extname(pdfPath).toLowerCase();

    const createFile = await new File({
      countPages: pageCount,
      fileSizeBytes,
      fileFormat,
      fileName: `${event.req.file.filename.split(".")[0]}`,
      url: `/uploads/${event.req.file.filename}`,
      authorID: decoded.userId,
    }).save();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        status: 404,
        message: "User not found",
        ok: false,
      };
    }

    user.files.push(createFile._id);
    await user.save();

    return {
      status: 200,
      message: {
        createFile,
        user
      },
      ok: true,
    };
  } catch (error) {
    return {
      status: 500,
      message: `${error}`,
      ok: false,
    };
  }
});
