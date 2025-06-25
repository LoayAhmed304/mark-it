import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { diff_match_patch, Diff } from 'diff-match-patch';

const dmp = new diff_match_patch();

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
    sameSite: 'lax', // prevent CSRF attacks
    secure: true,
  });
};

export function applyPatchServer(
  currentText: string,
  patchText: string,
): { newText: string; success: boolean } {
  const patches = dmp.patch_fromText(patchText);
  const [newText, results] = dmp.patch_apply(patches, currentText);
  const success = results.every((result) => result);
  return { newText, success };
}
