import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model.js';
import { Response, Request, NextFunction } from 'express';
interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("Couldn't fetch JWT secret");

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    if (!decoded) {
      res.status(401).json({ status: 'fail', message: 'Invalid' });
      return;
    }

    if (!decoded.userId) {
      res
        .status(401)
        .json({ status: 'fail', message: 'Invalid token, not userId' });
      return;
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
    return;
  }
};
