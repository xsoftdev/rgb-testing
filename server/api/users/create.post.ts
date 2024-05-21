import { readBody, defineEventHandler } from "h3";
import User from "./models/user.model";
import { IUser } from "~/server/interfaces/IUser.interface";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cloudinary from "~/server/db/cloudinary.conn";


const config = useRuntimeConfig() 

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { email, password, avatar }: IUser = JSON.parse(body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        status: 400,
        message: "User with this email already exists",
        ok: false,
      };
    }

    const bytes = avatar;
    const filename = `${email}_avatar`;

    const result = await cloudinary.uploader.upload(bytes, {
      public_id: filename,
    })

    const url = result.secure_url;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, avatar: url });
    await newUser.save();
    
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, config.privateRuntimeConfig.secret_key, { expiresIn: '24h' });

    return {
      status: 200,
      message: {
        email,
        url,
        session: token,
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
