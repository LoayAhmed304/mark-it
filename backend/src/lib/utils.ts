import { Response } from 'express';
import jwt from 'jsonwebtoken';
export const generateToken = async (
  userId: string,
  res: Response,
): Promise<void> => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent XSS attacks
    sameSite: 'strict', // prevent CSRF attacks
    secure: process.env.NODE_ENV !== 'development',
  });
};
