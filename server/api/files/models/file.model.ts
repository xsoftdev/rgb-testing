import { Schema, model } from "mongoose";
import { IFile } from "~/server/interfaces/IFiles.interfaces";

const FileSchema = new Schema<IFile>({
  fileName: {
    type: String,
    required: true
  },
  countPages: {
    type: Number,
    required: true,
  },
  fileSizeBytes: {
    type: Number,
    required: true,
  },
  fileFormat: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  authorID: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const fileModel = model("File", FileSchema);

export default fileModel;
