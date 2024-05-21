import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { password, newpassword, session } = JSON.parse(body);

    const decoded = jwt.decode(session);

    console.log(decoded)
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return {
        status: 404,
        message: 'User not found',
        ok: false,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: 400,
        message: 'Current password is incorrect',
        ok: false,
      };
    }

    const hashedNewPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return {
      status: 200,
      message: 'Password updated successfully',
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
