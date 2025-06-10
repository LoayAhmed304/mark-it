import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res
      .status(400)
      .json({ status: 'fail', message: 'All fields are required' });
    return;
  }

  try {
    if (password.length < 6) {
      res
        .status(400)
        .json({ status: 'fail', message: 'Password is too short (<6)' });
      return;
    }
    //  check email or username already exists in database

    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (user) {
      res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email or username',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    if (!newUser) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Failed to create user' });
      return;
    }

    await newUser.save();

    generateToken(newUser._id.toString(), res);

    res.status(201).json({
      status: 'success',
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ status: 'fail', message: 'All fields are required' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
    return;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
    return;
  }

  // Generate JWT token
  generateToken(user._id.toString(), res);

  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', '', { maxAge: 0 });
  res
    .status(200)
    .json({ status: 'success', message: 'Logged out successfully' });
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.status(200).json({
      status: 'success',
      data: req.user,
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};
