import User from "./models/user.model";

import { readBody } from 'h3';
import jwt from 'jsonwebtoken';

interface RequestBody {
  page: number;
  session: string;
}

interface DecodedJWT {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { page, session }: RequestBody = body;

    let id = jwt.decode(session) as DecodedJWT | null;

    const user = await User.findOne({ _id: id.userId }).populate({
      path: 'files',
      options: { 
        limit: 6,
        skip: (page - 1) * 6
      }
    });
    const files = await User.findOne({ _id: id.userId}).populate('files');
    const totalPages = Math.ceil(files.files.length / 6)

    if (!user) {
      return {
        status: 404,
        message: "User not found",
        ok: false,
      };
    }
    return {
      status: 200,
      message: {
        files: user.files,
        totalPages,
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