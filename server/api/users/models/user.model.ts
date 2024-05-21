import { Schema, model } from "mongoose";
import { IUser } from "~/server/interfaces/IUser.interface";

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

const userModel = model("User", UserSchema);

export default userModel;
