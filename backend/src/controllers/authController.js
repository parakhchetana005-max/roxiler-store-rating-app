import { login, signup, updatePassword } from '../services/authService.js';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const loginCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login(email, password);
    res.cookie('token', token, COOKIE_OPTS);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const signupCtrl = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;
    const user = await signup({ name, email, password, address });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const meCtrl = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });
    if (!user) return res.status(401).json({ errors: { auth: 'User not found' } });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const updatePasswordCtrl = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await updatePassword(req.user.id, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const logoutCtrl = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out successfully' });
};
