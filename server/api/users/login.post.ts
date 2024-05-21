import { readBody } from 'h3';
import bcrypt from "bcryptjs";
import User from "./models/user.model";
import jwt from "jsonwebtoken";

interface ILogin {
  email: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const config = useRuntimeConfig();
    const { email, password }: ILogin = JSON.parse(body);

    if (!email || !password) {
      return {
        status: 400,
        message: "Email and password are required.",
        ok: false,
      };
    }

    const user = await User.findOne({ email });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
        ok: false,
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        status: 401,
        message: "Invalid password",
        ok: false,
      };
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, config.privateRuntimeConfig.secret_key, {
      expiresIn: "24h",
    });

    return {
      status: 200,
      message: {
        session: token
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
