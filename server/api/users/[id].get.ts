import jwt from 'jsonwebtoken';
import User from './models/user.model';
import File from '../files/models/file.model';

interface EventContext {
  params?: {
    id?: string;
  };
}

interface DecodedJWT {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export default defineEventHandler(async (event: { context: EventContext }) => {
  try {
    const id = event.context.params?.id;
    let userId = id;

    if (id && id.length !== 24) {
      const decoded = jwt.decode(id) as DecodedJWT | null;
      if (decoded && decoded.userId) {
        userId = decoded.userId;
      } else {
        return {
          status: 401,
          message: 'Invalid session token',
          ok: false,
        };
      }
    }

    const user = await User.findById(userId).populate('files');
    if (!user) {
      return {
        status: 404,
        message: 'User not found',
        ok: false,
      };
    }

    return {
      status: 200,
      message: user,
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
