import { readBody } from "h3";
import jwt from "jsonwebtoken";
import User from './models/user.model'

interface ISession {
  session: string;
}

export default defineEventHandler(async (event) => {
  let newToken;
  const config = useRuntimeConfig();

  try {
    const body = (await readBody(event)) as ISession;

    const { session } = body;

    if (!session) {
      return {
        status: 400,
        message: "Missing token",
        ok: false,
      };
    }

    const secret = config.privateRuntimeConfig.secret_key;
    try {
      const decoded = jwt.verify(session, secret) as jwt.JwtPayload;

      const { exp, ...rest } = decoded;

      newToken = jwt.sign({ ...rest }, secret, {
        expiresIn: "24h",
      });
    } catch (err) {
      console.error('Token verification error:', err);
      return {
        status: 401,
        message: "Invalid token",
        ok: false,
      };
    }

    const decode = jwt.decode(session);

    if (decode.userId) {
      const user = await User.findOne({_id: decode.userId});

      if (!user) {
        return {
          status: 404,
          message: `User not found`,
          ok: false,
        };
      }
    }

    return {
      status: 200,
      message: {
        session: newToken,
      },
      ok: true,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      status: 500,
      message: `${error}`,
      ok: false,
    };
  }
});
