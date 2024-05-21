import cloudinary from "~/server/db/cloudinary.conn";
import User from './models/user.model';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { avatar, session } = JSON.parse(body);

    const decoded = jwt.decode(session);
    if (!decoded || !decoded.email) {
      return {
        status: 400,
        message: 'Invalid session token',
        ok: false,
      };
    }

    const bytes = avatar;
    const uuid = uuidv4();
    const filename = `${decoded.email}_avatar_${uuid}`;

    const result = await cloudinary.uploader.upload(bytes, {
      public_id: filename,
    });

    const url = result.secure_url;

    const user = await User.findOneAndUpdate(
      { _id: decoded.userId },
      { avatar: url },
      { new: true }
    );

    if (!user) {
      return {
        status: 404,
        message: 'User not found',
        ok: false,
      };
    }

    return {
      status: 200,
      message: 'Avatar updated successfully',
      ok: true,
      user,
    };
  } catch (error) {
    return {
      status: 500,
      message: `${error}`,
      ok: false,
    };
  }
});
